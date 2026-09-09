// src/lib/curriculum/contentRegistry.ts
// Single Source of Truth for Content Manifests with Draft/Archive Visibility Rules

import {
  DayNumber,
  PacketContentManifest,
  DayContentManifest,
  ContentBlock,
} from './contentTypes';
import { ContentValidator } from './contentValidator';
import { CurriculumValidationError } from './validator';

export interface ContentQueryOptions {
  allowDraft?: boolean;
  allowArchived?: boolean;
}

class ContentRegistry {
  private packets = new Map<string, PacketContentManifest>(); // packetId -> manifest
  private packetsByCode = new Map<string, PacketContentManifest>();

  public registerPacketContent(manifest: PacketContentManifest): void {
    ContentValidator.validatePacketManifest(manifest);

    if (this.packets.has(manifest.packetId)) {
      throw new CurriculumValidationError(
        `Packet content for '${manifest.packetId}' is already registered`,
        'PACKET_CONTENT_ALREADY_EXISTS'
      );
    }

    this.packets.set(manifest.packetId, manifest);
    this.packetsByCode.set(manifest.packetCode.toUpperCase(), manifest);
  }

  public getPacketContent(packetId: string, options: ContentQueryOptions = {}): PacketContentManifest | undefined {
    const manifest = this.packets.get(packetId);
    if (!manifest) return undefined;

    // Filter visibility
    if (manifest.status === 'DRAFT' && !options.allowDraft) return undefined;
    if (manifest.status === 'ARCHIVED' && !options.allowArchived) return undefined;

    return manifest;
  }

  public getPacketContentByCode(packetCode: string, options: ContentQueryOptions = {}): PacketContentManifest | undefined {
    const manifest = this.packetsByCode.get(packetCode.toUpperCase());
    if (!manifest) return undefined;

    if (manifest.status === 'DRAFT' && !options.allowDraft) return undefined;
    if (manifest.status === 'ARCHIVED' && !options.allowArchived) return undefined;

    return manifest;
  }

  public getDayContent(packetId: string, dayNumber: DayNumber, options: ContentQueryOptions = {}): DayContentManifest | undefined {
    const packet = this.getPacketContent(packetId, options);
    if (!packet) return undefined;

    const day = packet.days.find(d => d.dayNumber === dayNumber);
    if (!day) return undefined;

    if (day.status === 'DRAFT' && !options.allowDraft) return undefined;
    if (day.status === 'ARCHIVED' && !options.allowArchived) return undefined;

    return day;
  }

  public getAllPublishedPackets(): PacketContentManifest[] {
    return Array.from(this.packets.values()).filter(p => p.status === 'PUBLISHED');
  }

  public _reset(): void {
    this.packets.clear();
    this.packetsByCode.clear();
  }
}

export const contentRegistry = new ContentRegistry();
