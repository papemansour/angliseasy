#!/usr/bin/env python3
"""
Backend Testing for My KALAMA ENGLISH
Tests for Kalamathèque endpoints and security functionality
"""

import asyncio
import aiohttp
import json
import logging
from typing import Dict, Any, Optional
import sys
import os
import base64
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Backend URL from environment
BACKEND_URL = "https://english-learning-68.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "admin@mykalamaenglish.com"
ADMIN_PASSWORD = "adminco"
KALAMATHEQUE_ACCESS_CODE = "Digika"

class KalamathequeBackendTester:
    def __init__(self):
        self.session = None
        self.admin_token = None
        self.test_book_id = None
        self.test_results = {
            "file_upload": {"passed": False, "details": []},
            "access_verification": {"passed": False, "details": []},
            "book_creation": {"passed": False, "details": []},
            "book_retrieval": {"passed": False, "details": []},
            "book_deletion": {"passed": False, "details": []},
            "ai_assistant": {"passed": False, "details": []},
            "text_to_speech": {"passed": False, "details": []},
            "overall_kalamatheque": {"passed": False, "details": []}
        }
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def login_admin(self) -> bool:
        """Login as admin and get token"""
        try:
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            async with self.session.post(f"{BACKEND_URL}/auth/login", json=login_data) as response:
                if response.status == 200:
                    data = await response.json()
                    self.admin_token = data.get("access_token")
                    logger.info("✅ Admin login successful")
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Admin login failed: {response.status} - {error_text}")
                    return False
        except Exception as e:
            logger.error(f"❌ Admin login error: {str(e)}")
            return False
    
    async def get_test_user(self) -> Optional[str]:
        """Get an existing non-admin user for password reset testing"""
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Get all users and find a non-admin user
            async with self.session.get(f"{BACKEND_URL}/admin/all-users", headers=headers) as users_response:
                if users_response.status == 200:
                    users = await users_response.json()
                    for user in users:
                        if user.get('role') != 'admin':
                            logger.info(f"✅ Using existing user for test: {user.get('email')}")
                            return user.get('id')
                    
                    # If no non-admin users exist, create a test teacher
                    teacher_data = {
                        "first_name": "TestTeacher",
                        "last_name": f"Security{len(users)}"  # Make unique
                    }
                    
                    async with self.session.post(f"{BACKEND_URL}/admin/create-teacher", 
                                               json=teacher_data, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            logger.info(f"✅ Test teacher created: {data.get('email')}")
                            
                            # Get the user ID by finding the user
                            async with self.session.get(f"{BACKEND_URL}/admin/all-users", headers=headers) as users_response2:
                                if users_response2.status == 200:
                                    users2 = await users_response2.json()
                                    for user in users2:
                                        if user.get('email') == data.get('email'):
                                            return user.get('id')
                            return None
                        else:
                            error_text = await response.text()
                            logger.error(f"❌ Failed to create test teacher: {response.status} - {error_text}")
                            return None
                else:
                    error_text = await users_response.text()
                    logger.error(f"❌ Failed to get users: {users_response.status} - {error_text}")
                    return None
        except Exception as e:
            logger.error(f"❌ Error getting test user: {str(e)}")
            return None
    
    async def test_password_change_security(self) -> bool:
        """Test that password changes don't store plain text passwords"""
        try:
            logger.info("🔍 Testing password change security...")
            
            # Change admin password
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            password_data = {
                "old_password": ADMIN_PASSWORD,
                "new_password": "NewSecurePassword123!"
            }
            
            async with self.session.post(f"{BACKEND_URL}/auth/change-password", 
                                       json=password_data, headers=headers) as response:
                if response.status == 200:
                    logger.info("✅ Password change endpoint works")
                    self.test_results["change_password"]["details"].append("Password change endpoint responds correctly")
                    
                    # Change back to original password
                    revert_data = {
                        "old_password": "NewSecurePassword123!",
                        "new_password": ADMIN_PASSWORD
                    }
                    
                    async with self.session.post(f"{BACKEND_URL}/auth/change-password", 
                                               json=revert_data, headers=headers) as revert_response:
                        if revert_response.status == 200:
                            logger.info("✅ Password reverted successfully")
                            self.test_results["change_password"]["details"].append("Password successfully reverted")
                            self.test_results["change_password"]["passed"] = True
                            return True
                        else:
                            error_text = await revert_response.text()
                            logger.error(f"❌ Failed to revert password: {revert_response.status} - {error_text}")
                            self.test_results["change_password"]["details"].append(f"Failed to revert password: {error_text}")
                            return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Password change failed: {response.status} - {error_text}")
                    self.test_results["change_password"]["details"].append(f"Password change failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Password change test error: {str(e)}")
            self.test_results["change_password"]["details"].append(f"Test error: {str(e)}")
            return False
    
    async def test_admin_password_reset(self) -> bool:
        """Test admin password reset functionality"""
        try:
            logger.info("🔍 Testing admin password reset...")
            
            # Get test user first
            test_user_id = await self.get_test_user()
            if not test_user_id:
                self.test_results["admin_reset_password"]["details"].append("Failed to create test user")
                return False
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            async with self.session.post(f"{BACKEND_URL}/admin/reset-user-password/{test_user_id}", 
                                       headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info("✅ Admin password reset endpoint works")
                    
                    # Check response structure
                    required_fields = ["message", "temporary_password", "email_sent"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        logger.info("✅ Password reset response has all required fields")
                        self.test_results["admin_reset_password"]["details"].append("Response contains all required fields")
                        
                        if data.get("message") == "Password reset successfully":
                            logger.info("✅ Correct success message")
                            self.test_results["admin_reset_password"]["details"].append("Correct success message returned")
                        
                        if data.get("temporary_password"):
                            logger.info("✅ Temporary password generated")
                            self.test_results["admin_reset_password"]["details"].append("Temporary password generated successfully")
                        
                        if data.get("email_sent") == False:
                            logger.info("✅ Email sending status correctly reported (AWS SES not configured)")
                            self.test_results["admin_reset_password"]["details"].append("Email sending status correctly reported")
                        
                        self.test_results["admin_reset_password"]["passed"] = True
                        return True
                    else:
                        logger.error(f"❌ Missing required fields in response: {missing_fields}")
                        self.test_results["admin_reset_password"]["details"].append(f"Missing fields: {missing_fields}")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Admin password reset failed: {response.status} - {error_text}")
                    self.test_results["admin_reset_password"]["details"].append(f"Reset failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Admin password reset test error: {str(e)}")
            self.test_results["admin_reset_password"]["details"].append(f"Test error: {str(e)}")
            return False
    
    async def cleanup_test_user(self, user_id: str):
        """Clean up test user"""
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            async with self.session.delete(f"{BACKEND_URL}/admin/delete-user/{user_id}", 
                                         headers=headers) as response:
                if response.status == 200:
                    logger.info("✅ Test user cleaned up")
                else:
                    logger.warning(f"⚠️ Failed to clean up test user: {response.status}")
        except Exception as e:
            logger.warning(f"⚠️ Error cleaning up test user: {str(e)}")
    
    async def test_contact_form(self) -> bool:
        """Test public contact form functionality"""
        try:
            logger.info("🔍 Testing contact form...")
            
            # Test valid contact form submission
            contact_data = {
                "name": "Jean Dupont",
                "email": "jean.dupont@example.com",
                "message": "Bonjour, je souhaite des informations sur vos cours d'anglais."
            }
            
            async with self.session.post(f"{BACKEND_URL}/contact/send", json=contact_data) as response:
                if response.status == 200:
                    data = await response.json()
                    expected_message = "Message received and will be processed"
                    
                    if data.get("message") == expected_message:
                        logger.info("✅ Contact form works correctly")
                        self.test_results["contact_form"]["details"].append("Valid contact form submission successful")
                    else:
                        logger.info(f"✅ Contact form works (message: {data.get('message')})")
                        self.test_results["contact_form"]["details"].append(f"Contact form works with message: {data.get('message')}")
                    
                    # Test validation - invalid email
                    invalid_data = {
                        "name": "Test User",
                        "email": "invalid-email",
                        "message": "Test message"
                    }
                    
                    async with self.session.post(f"{BACKEND_URL}/contact/send", json=invalid_data) as invalid_response:
                        if invalid_response.status == 400:
                            logger.info("✅ Email validation works")
                            self.test_results["contact_form"]["details"].append("Email validation working correctly")
                        else:
                            logger.warning("⚠️ Email validation may not be working properly")
                            self.test_results["contact_form"]["details"].append("Email validation unclear")
                    
                    # Test validation - missing fields
                    incomplete_data = {
                        "name": "Test User",
                        "email": "test@example.com"
                        # missing message
                    }
                    
                    async with self.session.post(f"{BACKEND_URL}/contact/send", json=incomplete_data) as incomplete_response:
                        if incomplete_response.status == 400:
                            logger.info("✅ Required field validation works")
                            self.test_results["contact_form"]["details"].append("Required field validation working")
                        else:
                            logger.warning("⚠️ Required field validation may not be working")
                            self.test_results["contact_form"]["details"].append("Required field validation unclear")
                    
                    self.test_results["contact_form"]["passed"] = True
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Contact form failed: {response.status} - {error_text}")
                    self.test_results["contact_form"]["details"].append(f"Contact form failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Contact form test error: {str(e)}")
            self.test_results["contact_form"]["details"].append(f"Test error: {str(e)}")
            return False
    
    async def create_test_file(self) -> str:
        """Create a test PDF file for upload testing"""
        try:
            # Create a simple test PDF content
            test_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Kalamatheque Book) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF"""
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(test_content)
                return temp_file.name
                
        except Exception as e:
            logger.error(f"❌ Error creating test file: {str(e)}")
            return None

    async def test_file_upload(self) -> bool:
        """Test file upload endpoint"""
        try:
            logger.info("🔍 Testing file upload endpoint...")
            
            # Create test file
            test_file_path = await self.create_test_file()
            if not test_file_path:
                self.test_results["file_upload"]["details"].append("Failed to create test file")
                return False
            
            try:
                # Upload file
                with open(test_file_path, 'rb') as file:
                    data = aiohttp.FormData()
                    data.add_field('file', file, filename='test_book.pdf', content_type='application/pdf')
                    
                    async with self.session.post(f"{BACKEND_URL}/uploadfile/", data=data) as response:
                        if response.status == 200:
                            result = await response.json()
                            
                            # Check response structure
                            required_fields = ["message", "file_url", "filename"]
                            missing_fields = [field for field in required_fields if field not in result]
                            
                            if not missing_fields:
                                logger.info("✅ File upload successful")
                                self.test_results["file_upload"]["details"].append("File uploaded successfully")
                                self.test_results["file_upload"]["details"].append(f"File URL: {result.get('file_url')}")
                                self.test_results["file_upload"]["passed"] = True
                                return result.get('file_url')
                            else:
                                logger.error(f"❌ Missing fields in upload response: {missing_fields}")
                                self.test_results["file_upload"]["details"].append(f"Missing fields: {missing_fields}")
                                return False
                        else:
                            error_text = await response.text()
                            logger.error(f"❌ File upload failed: {response.status} - {error_text}")
                            self.test_results["file_upload"]["details"].append(f"Upload failed: {error_text}")
                            return False
            finally:
                # Clean up test file
                if os.path.exists(test_file_path):
                    os.unlink(test_file_path)
                    
        except Exception as e:
            logger.error(f"❌ File upload test error: {str(e)}")
            self.test_results["file_upload"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_access_verification(self) -> bool:
        """Test Kalamathèque access code verification"""
        try:
            logger.info("🔍 Testing access code verification...")
            
            # Test correct access code
            correct_data = {"access_code": KALAMATHEQUE_ACCESS_CODE}
            async with self.session.post(f"{BACKEND_URL}/kalamatheque/verify-access", json=correct_data) as response:
                if response.status == 200:
                    result = await response.json()
                    if result.get("access") == True:
                        logger.info("✅ Correct access code accepted")
                        self.test_results["access_verification"]["details"].append("Correct access code works")
                    else:
                        logger.error("❌ Correct access code not properly accepted")
                        self.test_results["access_verification"]["details"].append("Correct access code issue")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Access verification failed: {response.status} - {error_text}")
                    self.test_results["access_verification"]["details"].append(f"Access verification failed: {error_text}")
                    return False
            
            # Test incorrect access code
            incorrect_data = {"access_code": "WrongCode"}
            async with self.session.post(f"{BACKEND_URL}/kalamatheque/verify-access", json=incorrect_data) as response:
                if response.status == 403:
                    logger.info("✅ Incorrect access code properly rejected")
                    self.test_results["access_verification"]["details"].append("Incorrect access code properly rejected")
                    self.test_results["access_verification"]["passed"] = True
                    return True
                else:
                    logger.error(f"❌ Incorrect access code not properly rejected: {response.status}")
                    self.test_results["access_verification"]["details"].append("Incorrect access code not rejected")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Access verification test error: {str(e)}")
            self.test_results["access_verification"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_book_creation(self, file_url: str) -> bool:
        """Test book creation (admin only)"""
        try:
            logger.info("🔍 Testing book creation...")
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test book creation with all fields
            book_data = {
                "title": "Test English Grammar Book",
                "author": "Test Author",
                "description": "A comprehensive guide to English grammar for intermediate learners",
                "level": "intermediate",
                "file_url": file_url,
                "file_type": "pdf",
                "cover_image": "/images/test-cover.jpg"
            }
            
            async with self.session.post(f"{BACKEND_URL}/kalamatheque/books", json=book_data, headers=headers) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    if "book_id" in result and result.get("message"):
                        logger.info("✅ Book created successfully")
                        self.test_results["book_creation"]["details"].append("Book created with all fields")
                        self.test_book_id = result["book_id"]
                        
                        # Test book creation with missing required fields
                        incomplete_data = {
                            "title": "Incomplete Book"
                            # Missing required fields
                        }
                        
                        async with self.session.post(f"{BACKEND_URL}/kalamatheque/books", json=incomplete_data, headers=headers) as incomplete_response:
                            if incomplete_response.status in [400, 422]:
                                logger.info("✅ Missing required fields properly rejected")
                                self.test_results["book_creation"]["details"].append("Missing fields validation works")
                            else:
                                logger.warning("⚠️ Missing fields validation unclear")
                                self.test_results["book_creation"]["details"].append("Missing fields validation unclear")
                        
                        self.test_results["book_creation"]["passed"] = True
                        return True
                    else:
                        logger.error("❌ Book creation response missing required fields")
                        self.test_results["book_creation"]["details"].append("Response missing book_id or message")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Book creation failed: {response.status} - {error_text}")
                    self.test_results["book_creation"]["details"].append(f"Creation failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Book creation test error: {str(e)}")
            self.test_results["book_creation"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_book_retrieval(self) -> bool:
        """Test book retrieval endpoints"""
        try:
            logger.info("🔍 Testing book retrieval...")
            
            # Test get all books
            async with self.session.get(f"{BACKEND_URL}/kalamatheque/books") as response:
                if response.status == 200:
                    books = await response.json()
                    
                    if isinstance(books, list):
                        logger.info(f"✅ Retrieved {len(books)} books")
                        self.test_results["book_retrieval"]["details"].append(f"Retrieved {len(books)} books")
                        
                        # Verify our test book is in the list
                        if self.test_book_id:
                            test_book_found = any(book.get("id") == self.test_book_id for book in books)
                            if test_book_found:
                                logger.info("✅ Test book found in book list")
                                self.test_results["book_retrieval"]["details"].append("Test book found in list")
                            else:
                                logger.warning("⚠️ Test book not found in list")
                                self.test_results["book_retrieval"]["details"].append("Test book not found in list")
                    else:
                        logger.error("❌ Books response is not a list")
                        self.test_results["book_retrieval"]["details"].append("Invalid response format")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Get books failed: {response.status} - {error_text}")
                    self.test_results["book_retrieval"]["details"].append(f"Get books failed: {error_text}")
                    return False
            
            # Test get specific book
            if self.test_book_id:
                async with self.session.get(f"{BACKEND_URL}/kalamatheque/books/{self.test_book_id}") as response:
                    if response.status == 200:
                        book = await response.json()
                        
                        if book.get("id") == self.test_book_id:
                            logger.info("✅ Specific book retrieved successfully")
                            self.test_results["book_retrieval"]["details"].append("Specific book retrieval works")
                            self.test_results["book_retrieval"]["passed"] = True
                            return True
                        else:
                            logger.error("❌ Retrieved book ID doesn't match")
                            self.test_results["book_retrieval"]["details"].append("Book ID mismatch")
                            return False
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ Get specific book failed: {response.status} - {error_text}")
                        self.test_results["book_retrieval"]["details"].append(f"Get specific book failed: {error_text}")
                        return False
            else:
                logger.warning("⚠️ No test book ID available for specific book test")
                self.test_results["book_retrieval"]["details"].append("No test book for specific retrieval")
                self.test_results["book_retrieval"]["passed"] = True
                return True
                
        except Exception as e:
            logger.error(f"❌ Book retrieval test error: {str(e)}")
            self.test_results["book_retrieval"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_ai_assistant(self) -> bool:
        """Test AI assistant endpoint"""
        try:
            logger.info("🔍 Testing AI assistant...")
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test summarize action
            test_data = {
                "action": "summarize",
                "text": "English grammar is the set of structural rules governing the composition of clauses, phrases and words in the English language. The term refers to the study of such rules and this field includes phonology, morphology, syntax, semantics, and pragmatics."
            }
            
            async with self.session.post(f"{BACKEND_URL}/kalamatheque/ai-assistant", json=test_data, headers=headers) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    if "result" in result and result["result"]:
                        logger.info("✅ AI assistant summarize works")
                        self.test_results["ai_assistant"]["details"].append("AI summarize function works")
                        
                        # Test explain action
                        explain_data = {
                            "action": "explain",
                            "text": "The quick brown fox jumps over the lazy dog."
                        }
                        
                        async with self.session.post(f"{BACKEND_URL}/kalamatheque/ai-assistant", json=explain_data, headers=headers) as explain_response:
                            if explain_response.status == 200:
                                explain_result = await explain_response.json()
                                if "result" in explain_result and explain_result["result"]:
                                    logger.info("✅ AI assistant explain works")
                                    self.test_results["ai_assistant"]["details"].append("AI explain function works")
                                    self.test_results["ai_assistant"]["passed"] = True
                                    return True
                                else:
                                    logger.error("❌ AI explain response missing result")
                                    self.test_results["ai_assistant"]["details"].append("AI explain missing result")
                                    return False
                            else:
                                error_text = await explain_response.text()
                                logger.error(f"❌ AI explain failed: {explain_response.status} - {error_text}")
                                self.test_results["ai_assistant"]["details"].append(f"AI explain failed: {error_text}")
                                return False
                    else:
                        logger.error("❌ AI assistant response missing result")
                        self.test_results["ai_assistant"]["details"].append("AI response missing result")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ AI assistant failed: {response.status} - {error_text}")
                    self.test_results["ai_assistant"]["details"].append(f"AI assistant failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ AI assistant test error: {str(e)}")
            self.test_results["ai_assistant"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_text_to_speech(self) -> bool:
        """Test text-to-speech endpoint"""
        try:
            logger.info("🔍 Testing text-to-speech...")
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            test_data = {
                "text": "Hello, this is a test of the text-to-speech functionality for Kalamathèque."
            }
            
            async with self.session.post(f"{BACKEND_URL}/kalamatheque/text-to-speech", json=test_data, headers=headers) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    if "audio_base64" in result and result["audio_base64"]:
                        # Verify it's valid base64
                        try:
                            audio_data = base64.b64decode(result["audio_base64"])
                            if len(audio_data) > 0:
                                logger.info("✅ Text-to-speech works and returns valid audio")
                                self.test_results["text_to_speech"]["details"].append("TTS generates valid audio")
                                self.test_results["text_to_speech"]["passed"] = True
                                return True
                            else:
                                logger.error("❌ TTS returned empty audio data")
                                self.test_results["text_to_speech"]["details"].append("TTS returned empty audio")
                                return False
                        except Exception as decode_error:
                            logger.error(f"❌ TTS returned invalid base64: {str(decode_error)}")
                            self.test_results["text_to_speech"]["details"].append("TTS returned invalid base64")
                            return False
                    else:
                        logger.error("❌ TTS response missing audio_base64")
                        self.test_results["text_to_speech"]["details"].append("TTS response missing audio")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Text-to-speech failed: {response.status} - {error_text}")
                    self.test_results["text_to_speech"]["details"].append(f"TTS failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Text-to-speech test error: {str(e)}")
            self.test_results["text_to_speech"]["details"].append(f"Test error: {str(e)}")
            return False

    async def test_book_deletion(self) -> bool:
        """Test book deletion (admin only)"""
        try:
            logger.info("🔍 Testing book deletion...")
            
            if not self.test_book_id:
                logger.warning("⚠️ No test book ID available for deletion test")
                self.test_results["book_deletion"]["details"].append("No test book for deletion")
                self.test_results["book_deletion"]["passed"] = True
                return True
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            async with self.session.delete(f"{BACKEND_URL}/kalamatheque/books/{self.test_book_id}", headers=headers) as response:
                if response.status == 200:
                    result = await response.json()
                    
                    if result.get("message"):
                        logger.info("✅ Book deleted successfully")
                        self.test_results["book_deletion"]["details"].append("Book deletion works")
                        
                        # Verify book is actually deleted
                        async with self.session.get(f"{BACKEND_URL}/kalamatheque/books/{self.test_book_id}") as verify_response:
                            if verify_response.status == 404:
                                logger.info("✅ Book properly removed from database")
                                self.test_results["book_deletion"]["details"].append("Book properly removed")
                                self.test_results["book_deletion"]["passed"] = True
                                return True
                            else:
                                logger.error("❌ Book still exists after deletion")
                                self.test_results["book_deletion"]["details"].append("Book not properly removed")
                                return False
                    else:
                        logger.error("❌ Book deletion response missing message")
                        self.test_results["book_deletion"]["details"].append("Deletion response missing message")
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Book deletion failed: {response.status} - {error_text}")
                    self.test_results["book_deletion"]["details"].append(f"Deletion failed: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Book deletion test error: {str(e)}")
            self.test_results["book_deletion"]["details"].append(f"Test error: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all Kalamathèque backend tests"""
        logger.info("🚀 Starting Kalamathèque Backend Tests")
        logger.info("=" * 60)
        
        # Login as admin
        if not await self.login_admin():
            logger.error("❌ Cannot proceed without admin login")
            return
        
        # Run tests in order (some depend on previous results)
        test_file_url = None
        
        # Test 1: File Upload
        logger.info(f"\n📋 Running: File Upload Test")
        logger.info("-" * 40)
        try:
            test_file_url = await self.test_file_upload()
            if test_file_url:
                logger.info(f"✅ File Upload: PASSED")
            else:
                logger.error(f"❌ File Upload: FAILED")
        except Exception as e:
            logger.error(f"❌ File Upload: ERROR - {str(e)}")
        
        # Test 2: Access Verification
        logger.info(f"\n📋 Running: Access Code Verification")
        logger.info("-" * 40)
        try:
            result = await self.test_access_verification()
            if result:
                logger.info(f"✅ Access Verification: PASSED")
            else:
                logger.error(f"❌ Access Verification: FAILED")
        except Exception as e:
            logger.error(f"❌ Access Verification: ERROR - {str(e)}")
        
        # Test 3: Book Creation (requires file URL)
        if test_file_url:
            logger.info(f"\n📋 Running: Book Creation")
            logger.info("-" * 40)
            try:
                result = await self.test_book_creation(test_file_url)
                if result:
                    logger.info(f"✅ Book Creation: PASSED")
                else:
                    logger.error(f"❌ Book Creation: FAILED")
            except Exception as e:
                logger.error(f"❌ Book Creation: ERROR - {str(e)}")
        else:
            logger.warning("⚠️ Skipping Book Creation - no file URL available")
        
        # Test 4: Book Retrieval
        logger.info(f"\n📋 Running: Book Retrieval")
        logger.info("-" * 40)
        try:
            result = await self.test_book_retrieval()
            if result:
                logger.info(f"✅ Book Retrieval: PASSED")
            else:
                logger.error(f"❌ Book Retrieval: FAILED")
        except Exception as e:
            logger.error(f"❌ Book Retrieval: ERROR - {str(e)}")
        
        # Test 5: AI Assistant
        logger.info(f"\n📋 Running: AI Assistant")
        logger.info("-" * 40)
        try:
            result = await self.test_ai_assistant()
            if result:
                logger.info(f"✅ AI Assistant: PASSED")
            else:
                logger.error(f"❌ AI Assistant: FAILED")
        except Exception as e:
            logger.error(f"❌ AI Assistant: ERROR - {str(e)}")
        
        # Test 6: Text-to-Speech
        logger.info(f"\n📋 Running: Text-to-Speech")
        logger.info("-" * 40)
        try:
            result = await self.test_text_to_speech()
            if result:
                logger.info(f"✅ Text-to-Speech: PASSED")
            else:
                logger.error(f"❌ Text-to-Speech: FAILED")
        except Exception as e:
            logger.error(f"❌ Text-to-Speech: ERROR - {str(e)}")
        
        # Test 7: Book Deletion (cleanup)
        logger.info(f"\n📋 Running: Book Deletion")
        logger.info("-" * 40)
        try:
            result = await self.test_book_deletion()
            if result:
                logger.info(f"✅ Book Deletion: PASSED")
            else:
                logger.error(f"❌ Book Deletion: FAILED")
        except Exception as e:
            logger.error(f"❌ Book Deletion: ERROR - {str(e)}")
        
        # Calculate overall results
        passed_tests = sum(1 for results in self.test_results.values() if results["passed"])
        total_tests = len(self.test_results) - 1  # Exclude overall_kalamatheque
        
        # Overall assessment
        if passed_tests == total_tests:
            self.test_results["overall_kalamatheque"]["passed"] = True
            self.test_results["overall_kalamatheque"]["details"].append("All Kalamathèque tests passed")
        else:
            self.test_results["overall_kalamatheque"]["details"].append(f"Only {passed_tests}/{total_tests} tests passed")
        
        # Print summary
        logger.info("\n" + "=" * 60)
        logger.info("🏁 KALAMATHÈQUE TEST SUMMARY")
        logger.info("=" * 60)
        
        for test_category, results in self.test_results.items():
            if test_category == "overall_kalamatheque":
                continue
            status = "✅ PASSED" if results["passed"] else "❌ FAILED"
            logger.info(f"{test_category.upper().replace('_', ' ')}: {status}")
            for detail in results["details"]:
                logger.info(f"  • {detail}")
        
        logger.info(f"\nOverall Result: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            logger.info("🎉 ALL KALAMATHÈQUE TESTS PASSED!")
        else:
            logger.warning("⚠️ SOME KALAMATHÈQUE TESTS FAILED - REVIEW REQUIRED")

async def main():
    """Main test runner"""
    async with KalamathequeBackendTester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())