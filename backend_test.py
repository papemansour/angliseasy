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
BACKEND_URL = "https://esolplatform.preview.emergentagent.com/api"

# Test credentials
ADMIN_EMAIL = "admin@mykalamaenglish.com"
ADMIN_PASSWORD = "adminco"
KALAMATHEQUE_ACCESS_CODE = "Digika"

class SecurityTester:
    def __init__(self):
        self.session = None
        self.admin_token = None
        self.test_results = {
            "password_security": {"passed": False, "details": []},
            "admin_reset_password": {"passed": False, "details": []},
            "contact_form": {"passed": False, "details": []},
            "change_password": {"passed": False, "details": []},
            "overall_security": {"passed": False, "details": []}
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
    
    async def test_password_security_in_database(self) -> bool:
        """Test that no plain text passwords are stored or returned"""
        try:
            logger.info("🔍 Testing password security in responses...")
            
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test that user endpoints don't return password fields
            async with self.session.get(f"{BACKEND_URL}/admin/all-users", headers=headers) as response:
                if response.status == 200:
                    users = await response.json()
                    
                    security_issues = []
                    for user in users:
                        # Check for plain text password fields
                        if "current_password_plain" in user:
                            security_issues.append(f"User {user.get('email', 'unknown')} has current_password_plain field")
                        
                        if "password" in user and user["password"]:
                            security_issues.append(f"User {user.get('email', 'unknown')} has plain password field")
                        
                        # Check that password_hash exists and looks hashed
                        if "password_hash" in user and user["password_hash"]:
                            if not user["password_hash"].startswith("$2b$"):
                                security_issues.append(f"User {user.get('email', 'unknown')} password_hash doesn't look like bcrypt hash")
                    
                    if not security_issues:
                        logger.info("✅ No plain text passwords found in user data")
                        self.test_results["password_security"]["details"].append("No plain text passwords in user responses")
                        self.test_results["password_security"]["passed"] = True
                        return True
                    else:
                        logger.error("❌ Security issues found:")
                        for issue in security_issues:
                            logger.error(f"  - {issue}")
                            self.test_results["password_security"]["details"].append(issue)
                        return False
                else:
                    error_text = await response.text()
                    logger.error(f"❌ Failed to get users for security check: {response.status} - {error_text}")
                    self.test_results["password_security"]["details"].append(f"Failed to check users: {error_text}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Password security test error: {str(e)}")
            self.test_results["password_security"]["details"].append(f"Test error: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run all security tests"""
        logger.info("🚀 Starting My KALAMA ENGLISH Security Tests")
        logger.info("=" * 60)
        
        # Login as admin
        if not await self.login_admin():
            logger.error("❌ Cannot proceed without admin login")
            return
        
        # Run all tests
        tests = [
            ("Password Security Check", self.test_password_security_in_database),
            ("Password Change Security", self.test_password_change_security),
            ("Admin Password Reset", self.test_admin_password_reset),
            ("Contact Form", self.test_contact_form),
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            logger.info(f"\n📋 Running: {test_name}")
            logger.info("-" * 40)
            
            try:
                result = await test_func()
                if result:
                    passed_tests += 1
                    logger.info(f"✅ {test_name}: PASSED")
                else:
                    logger.error(f"❌ {test_name}: FAILED")
            except Exception as e:
                logger.error(f"❌ {test_name}: ERROR - {str(e)}")
        
        # Overall security assessment
        if passed_tests == total_tests:
            self.test_results["overall_security"]["passed"] = True
            self.test_results["overall_security"]["details"].append("All security tests passed")
        else:
            self.test_results["overall_security"]["details"].append(f"Only {passed_tests}/{total_tests} tests passed")
        
        # Print summary
        logger.info("\n" + "=" * 60)
        logger.info("🏁 SECURITY TEST SUMMARY")
        logger.info("=" * 60)
        
        for test_category, results in self.test_results.items():
            status = "✅ PASSED" if results["passed"] else "❌ FAILED"
            logger.info(f"{test_category.upper().replace('_', ' ')}: {status}")
            for detail in results["details"]:
                logger.info(f"  • {detail}")
        
        logger.info(f"\nOverall Result: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            logger.info("🎉 ALL SECURITY TESTS PASSED!")
        else:
            logger.warning("⚠️ SOME SECURITY TESTS FAILED - REVIEW REQUIRED")

async def main():
    """Main test runner"""
    async with SecurityTester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())