'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Parse cookies helper function
function parseCookies() {
  if (typeof document === 'undefined') {
    return {};
  }
  
  const cookies = {};
  const cookieString = document.cookie;
  
  if (cookieString) {
    const pairs = cookieString.split(';');
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].trim();
      
      // Find the first '=' to split the name and value
      const firstEqualIndex = pair.indexOf('=');
      if (firstEqualIndex > 0) {
        const name = pair.substring(0, firstEqualIndex);
        const rawValue = pair.substring(firstEqualIndex + 1);
        
        try {
          // Decode the cookie value
          let decodedValue = decodeURIComponent(rawValue);
          
          // Remove surrounding quotes if present
          if (decodedValue.startsWith('"') && decodedValue.endsWith('"')) {
            decodedValue = decodedValue.slice(1, -1);
          }
          
          cookies[name] = decodedValue;
        } catch (e) {
          // If decoding fails, use the raw value
          cookies[name] = rawValue;
        }
      }
    }
  }
  
  return cookies;
}

// Set cookie helper function
function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') {
    return;
  }
  
  const cookieOptions = {
    path: '/',
    ...options
  };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (cookieOptions.path) {
    cookieString += `;path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.maxAge) {
    cookieString += `;max-age=${cookieOptions.maxAge}`;
  }
  
  if (cookieOptions.sameSite) {
    cookieString += `;SameSite=${cookieOptions.sameSite}`;
  }
  
  document.cookie = cookieString;
}

// Remove cookie helper function
function removeCookie(name) {
  if (typeof document === 'undefined') {
    return;
  }
  
  document.cookie = `${name}=;path=/;max-age=0`;
}

// User cookie keys
const USER_COOKIE_KEYS = [
  'user_id', 
  'user_email', 
  'user_name', 
  'user_picture', 
  'user_given_name', 
  'user_family_name', 
  'user_hd', 
  'user_verified_email'
];

// 检查用户是否已认证
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 cookies 读取用户数据
    const loadUser = () => {
      try {
        const cookies = parseCookies();
        
        // Check if user is logged in by checking user_id cookie
        if (cookies.user_id) {
          // Build user object from individual cookies
          const userData = {
            id: cookies.user_id || '',
            email: cookies.user_email || '',
            name: cookies.user_name || '',
            picture: cookies.user_picture || '',
            given_name: cookies.user_given_name || '',
            family_name: cookies.user_family_name || '',
            hd: cookies.user_hd || '',
            verified_email: cookies.user_verified_email === 'true'
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data from cookies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // 添加事件监听器，以便在cookie变化时更新状态
    const handleCookieChange = () => {
      loadUser();
    };
    
    window.addEventListener('cookie-change', handleCookieChange);
    
    return () => {
      window.removeEventListener('cookie-change', handleCookieChange);
    };
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

// 用于客户端组件中保护路由
export function useRequireAuth(redirectUrl = '/login') {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`${redirectUrl}?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [loading, isAuthenticated, redirectUrl, router]);

  return { user, loading, isAuthenticated };
}

// 登出函数
export function logout(callback) {
  // Remove all user cookies
  USER_COOKIE_KEYS.forEach(key => {
    removeCookie(key);
  });
  
  // 触发自定义事件，以便其他组件更新状态
  window.dispatchEvent(new Event('cookie-change'));
  if (callback) {
    callback();
  }
}

// 获取用户信息
export function getUser() {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const cookies = parseCookies();
    
    // Check if user is logged in by checking user_id cookie
    if (!cookies.user_id) {
      return null;
    }
    
    // Build user object from individual cookies
    return {
      id: cookies.user_id || '',
      email: cookies.user_email || '',
      name: cookies.user_name || '',
      picture: cookies.user_picture || '',
      given_name: cookies.user_given_name || '',
      family_name: cookies.user_family_name || '',
      hd: cookies.user_hd || '',
      verified_email: cookies.user_verified_email === 'true'
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
} 