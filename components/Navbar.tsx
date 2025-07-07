'use client';

import React from 'react';

interface NavbarProps {
  title: string;
}

const Navbar = ({ title }: NavbarProps) => {
  return (
    <div className="w-full mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default Navbar;
