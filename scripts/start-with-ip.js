#!/usr/bin/env node

const os = require('os');
const { spawn } = require('child_process');

console.log('\n================================================================');
console.log('🚀 DWELLIST EXPO SMART LAUNCHER');
console.log('================================================================');

// Detect Network Interfaces
const interfaces = os.networkInterfaces();
let physicalIp = null;
let virtualIpFound = [];

for (const [name, info] of Object.entries(interfaces)) {
  for (const details of info) {
    if (details.family === 'IPv4' && !details.internal) {
      const isVirtual = /virtual|vbox|vmware|vpn|docker|wsl|vEthernet/i.test(name);
      if (isVirtual) {
        virtualIpFound.push(`${name} (${details.address})`);
      } else if (!physicalIp) {
        physicalIp = details.address;
        console.log(`✅ Detected Physical Wi-Fi IP: ${physicalIp} [Interface: ${name}]`);
      }
    }
  }
}

if (virtualIpFound.length > 0) {
  console.log(`⚠️ Ignored Virtual Adapters: ${virtualIpFound.join(', ')}`);
}

if (physicalIp) {
  process.env.REACT_NATIVE_PACKAGER_HOSTNAME = physicalIp;
  console.log(`📌 Forced Metro packager hostname to: ${physicalIp}`);
} else {
  console.log('⚠️ No physical Wi-Fi adapter detected. Expo will use default interface selection.');
}

console.log('----------------------------------------------------------------\n');

// Forward arguments to expo start
const extraArgs = process.argv.slice(2);
const child = spawn('npx', ['expo', 'start', ...extraArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
