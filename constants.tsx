
import React from 'react';
import { Shield, Lock, Terminal, Activity, Zap, Cpu, Search, MessageSquare } from 'lucide-react';
import { SecurityTool } from './types';

export const TOOLS_DATA: SecurityTool[] = [
  {
    id: '1',
    name: 'Wireshark',
    category: 'Network',
    description: 'Trình phân tích giao thức mạng nổi tiếng nhất thế giới, cho phép bạn xem những gì đang xảy ra trên mạng của mình ở cấp độ vi mô.',
    icon: 'Terminal',
    url: 'https://www.wireshark.org/'
  },
  {
    id: '2',
    name: 'Burp Suite',
    category: 'Web',
    description: 'Nền tảng tích hợp để thực hiện kiểm tra an ninh các ứng dụng web.',
    icon: 'Shield',
    url: 'https://portswigger.net/burp'
  },
  {
    id: '3',
    name: 'Nmap',
    category: 'Network',
    description: 'Công cụ mã nguồn mở miễn phí để khám phá mạng và kiểm tra bảo mật.',
    icon: 'Search',
    url: 'https://nmap.org/'
  },
  {
    id: '4',
    name: 'Metasploit',
    category: 'System',
    description: 'Phần mềm kiểm tra thâm nhập phổ biến nhất thế giới.',
    icon: 'Zap',
    url: 'https://www.metasploit.com/'
  },
  {
    id: '5',
    name: 'Bitwarden',
    category: 'Privacy',
    description: 'Trình quản lý mật khẩu mã nguồn mở an toàn nhất cho cá nhân và doanh nghiệp.',
    icon: 'Lock',
    url: 'https://bitwarden.com/'
  }
];

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: Activity },
  { id: 'TIPS', label: 'Tips & Tricks', icon: Shield },
  { id: 'TOOLKIT', label: 'Security Toolkit', icon: Cpu },
  { id: 'ANALYZE', label: 'Threat Analyzer', icon: Search },
  { id: 'AI_ASSISTANT', label: 'AI Assistant', icon: MessageSquare }
];
