import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import fs from 'fs';
import path from 'path';

// Stub CSS imports for Node.js test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import {
  STUDENT_NAV,
  BOTTOM_NAV,
  isPathActive,
  type NavLeaf,
} from '../src/components/ui/AppSidebar';

describe('BRUTAL VERIFICATION: Pins & Wallet and Item Shop Unified Hub Merge', () => {

  it('1. Left Sidebar Navigation removes loose "Pins & Shop" tab from student sidebar per Task 2', () => {
    const studentItems = STUDENT_NAV[0].items.filter((item): item is NavLeaf => 'href' in item);
    const shopItem = studentItems.find(item => item.href === '/shop');

    assert.equal(shopItem, undefined, 'STUDENT_NAV must NOT contain /shop item per Task 2');

    // Confirm no loose duplicate /pins in STUDENT_NAV or BOTTOM_NAV
    const loosePinsInStudentNav = studentItems.find(item => item.href === '/pins');
    assert.equal(loosePinsInStudentNav, undefined, 'There must be no duplicate /pins in STUDENT_NAV');

    const loosePinsInBottomNav = BOTTOM_NAV.find(item => item.href === '/pins');
    assert.equal(loosePinsInBottomNav, undefined, 'There must be no duplicate /pins in BOTTOM_NAV');
  });

  it('2. isPathActive highlights "Pins & Shop" when on /shop or /pins', () => {
    // Exact route
    assert.equal(isPathActive('/shop', '/shop'), true, '/shop must activate on /shop');
    // Alias route /pins highlights /shop
    assert.equal(isPathActive('/pins', '/shop'), true, '/pins must activate /shop tab');
    // Reverse alias check
    assert.equal(isPathActive('/shop', '/pins'), true, '/shop must activate /pins if checked');
  });

  it('3. AppShell.tsx registers unified titles and student routing permissions', () => {
    const shellPath = path.resolve(__dirname, '../src/components/ui/AppShell.tsx');
    const shellContent = fs.readFileSync(shellPath, 'utf8');

    // Page titles
    assert.ok(
      shellContent.includes("'/shop':          'Pins & Shop'") ||
      shellContent.includes("'/shop': 'Pins & Shop'"),
      'AppShell PAGE_TITLES must map /shop to "Pins & Shop"'
    );
    assert.ok(
      shellContent.includes("'/pins':          'Pins & Shop'") ||
      shellContent.includes("'/pins': 'Pins & Shop'"),
      'AppShell PAGE_TITLES must map /pins to "Pins & Shop"'
    );

    // Routing whitelist includes both
    assert.ok(shellContent.includes("'/shop'"), 'allowedStudentTabs must include /shop');
    assert.ok(shellContent.includes("'/pins'"), 'allowedStudentTabs must include /pins');
  });

  it('4. ShopPage contains Master Switcher for "Item Shop" and "Pins & Wallet"', () => {
    const shopPath = path.resolve(__dirname, '../src/app/shop/page.tsx');
    const shopContent = fs.readFileSync(shopPath, 'utf8');

    // Master Switcher testid & labels
    assert.ok(shopContent.includes('data-testid="shop-master-switcher"'), 'Must have shop-master-switcher');
    assert.ok(shopContent.includes('data-testid="tab-item-shop"'), 'Must have tab-item-shop');
    assert.ok(shopContent.includes('data-testid="tab-pins-wallet"'), 'Must have tab-pins-wallet');
    assert.ok(shopContent.includes('Item Shop'), 'Must contain Item Shop label');
    assert.ok(shopContent.includes('Pins & Wallet'), 'Must contain Pins & Wallet label');

    // Embedding PinsWalletPage
    assert.ok(shopContent.includes('PinsWalletPage'), 'ShopPage must import and embed PinsWalletPage');
    assert.ok(shopContent.includes('embedded={true}'), 'Must pass embedded={true} to PinsWalletPage');
  });

  it('5. PinsWalletPage supports embedded mode and navigation back to Shop', () => {
    const pinsPath = path.resolve(__dirname, '../src/app/pins/page.tsx');
    const pinsContent = fs.readFileSync(pinsPath, 'utf8');

    // Embedded prop signature
    assert.ok(pinsContent.includes('embedded?: boolean'), 'PinsWalletPage must accept embedded prop');
    assert.ok(pinsContent.includes('data-testid="pins-shop-master-switcher"'), 'Standalone /pins must render master switcher');
  });
});
