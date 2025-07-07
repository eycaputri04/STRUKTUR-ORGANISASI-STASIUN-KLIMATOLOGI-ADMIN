'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface QuickAccessCardProps {
  icon: string;
  iconColor?: string;
  bgColor?: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function QuickAccessCard({
  icon,
  title,
  subtitle,
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-100',
  onClick,
}: QuickAccessCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer hover:bg-gray-50 flex items-center gap-4 w-full"
    >
      <div className={`${bgColor} ${iconColor} p-3 rounded-full`}>
        <Icon icon={icon} width={24} height={24} />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
