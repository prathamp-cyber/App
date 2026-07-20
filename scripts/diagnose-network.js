#!/usr/bin/env node

const os = require('os');

console.log('================================================================');
console.log('🔍 EXPO GO CONNECTION DIAGNOSTIC UTILITY');
console.log('================================================================\n');

// 1. Get Network Interfaces
const interfaces = os.networkInterfaces();
const ipv4Addresses = [];
let hasVirtualAdapters = false;

console.log('📋 Detected Network Interfaces:');
for (const [name, info] of Object.entries(interfaces)) {
  for (const details of info) {
    if (details.family === 'IPv4' && !details.internal) {
      const isVirtual = /virtual|vbox|vmware|vpn|docker|wsl|vEthernet/i.test(name);
      if (isVirtual) {
        hasVirtualAdapters = true;
      }
      ipv4Addresses.push({
        interface: name,
        ip: details.address,
        virtual: isVirtual
      });
      console.log(`  - [${name}] IP: ${details.address} ${isVirtual ? '⚠️ (Virtual/VPN/WSL)' : '✅ (Physical/Wi-Fi)'}`);
    }
  }
}

console.log('\n----------------------------------------------------------------');

// 2. Analyze results
if (ipv4Addresses.length === 0) {
  console.log('❌ ERROR: No active network interfaces found! Please connect to Wi-Fi or local network.');
} else {
  console.log('📊 Diagnostic Summary:');

  if (ipv4Addresses.length > 1) {
    console.log('⚠️ Multiple network adapters detected!');
    console.log('   Expo Metro Bundler might bind to a virtual network adapter instead of your physical Wi-Fi.');
    console.log('   This is a common reason why Expo Go on your mobile phone cannot scan or connect.');
    
    const physical = ipv4Addresses.find(addr => !addr.virtual);
    if (physical) {
      console.log(`\n👉 RECOMMENDED FIX (Force LAN Bind):`);
      console.log(`   Force Expo to use your physical adapter IP (${physical.ip}) by starting the app like this:`);
      console.log(`\n   Powershell:`);
      console.log(`     $env:REACT_NATIVE_PACKAGER_HOSTNAME="${physical.ip}"; npm start`);
      console.log(`\n   Command Prompt (CMD):`);
      console.log(`     set REACT_NATIVE_PACKAGER_HOSTNAME=${physical.ip}&& npm start`);
    }
  } else {
    console.log('✅ Only one network adapter detected. IP auto-binding should work correctly.');
  }

  console.log('\n🌐 CONNECTION OPTIONS:');
  console.log('----------------------------------------------------------------');
  console.log('🚀 OPTION A (easiest & most reliable): Run with Tunnel');
  console.log('   This works even if your computer and phone are on different networks,');
  console.log('   or if you are on a restricted network (corporate/school/cafe Wi-Fi),');
  console.log('   or if your computer\'s firewall blocks local incoming connections.');
  console.log('\n   👉 Run:');
  console.log('      npm run tunnel');
  console.log('----------------------------------------------------------------');
  console.log('⚡ OPTION B (fastest performance): Run over LAN');
  console.log('   Requirements:');
  console.log('   1. Both your computer and phone must be on the EXACT SAME Wi-Fi network.');
  console.log('   2. On Windows, change your Wi-Fi network profile from "Public" to "Private".');
  console.log('      (Public networks automatically block incoming connections like Metro).');
  console.log('   3. Ensure Windows Defender Firewall allows node.exe on Private networks.');
  console.log('   4. On iOS, make sure Expo Go has "Local Network" access enabled in Settings.');
  console.log('----------------------------------------------------------------\n');
}
