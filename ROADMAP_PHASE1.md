# Phase 1 Implementation Plan: Collaboration & PWA

This document provides a detailed implementation plan for Phase 1 features: Collaboration and PWA/Offline Support.

## Collaboration Feature

### Database Schema Changes

```prisma
// Add to schema.prisma

model ItineraryShare {
  id          String   @id @default(cuid())
  itineraryId String   @map("itinerary_id")
  userId      String?  @map("user_id") // null for email invites
  email       String?  // for non-user invitations
  role        String   // "owner" | "editor" | "viewer"
  invitedBy   String   @map("invited_by")
  invitedAt   DateTime @default(now()) @map("invited_at")
  acceptedAt  DateTime? @map("accepted_at")
  token       String   @unique // for email invitation links
  
  itinerary   Itinerary @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([itineraryId])
  @@index([userId])
  @@index([token])
  @@map("itinerary_shares")
}

model ItineraryComment {
  id          String   @id @default(cuid())
  itineraryId String   @map("itinerary_id")
  itemId      String?  @map("item_id") // null for general comments
  userId      String   @map("user_id")
  content     String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  itinerary   Itinerary      @relation(fields: [itineraryId], references: [id], onDelete: Cascade)
  item        ItineraryItem? @relation(fields: [itemId], references: [id], onDelete: Cascade)
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([itineraryId])
  @@index([itemId])
  @@map("itinerary_comments")
}

// Update Itinerary model
model Itinerary {
  // ... existing fields
  shares      ItineraryShare[]
  comments    ItineraryComment[]
}

// Update User model
model User {
  // ... existing fields
  sharedItineraries ItineraryShare[]
  comments          ItineraryComment[]
}
```

### API Routes

#### 1. Share Itinerary

**Route**: `POST /api/itineraries/[id]/share`

```typescript
// src/app/api/itineraries/[id]/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendInviteEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { email, role = 'viewer' } = body;

  // Verify user owns itinerary
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: { shares: true },
  });

  if (!itinerary || itinerary.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Generate invitation token
  const token = crypto.randomUUID();

  // Create share record
  const share = await prisma.itineraryShare.create({
    data: {
      itineraryId: id,
      email,
      role,
      invitedBy: session.user.id,
      token,
    },
  });

  // Send invitation email
  if (email) {
    await sendInviteEmail(email, itinerary, token);
  }

  return NextResponse.json({ share, inviteLink: `/invite/${token}` });
}
```

#### 2. List Collaborators

**Route**: `GET /api/itineraries/[id]/collaborators`

```typescript
// src/app/api/itineraries/[id]/collaborators/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Check access
  const hasAccess = await checkItineraryAccess(id, session.user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const collaborators = await prisma.itineraryShare.findMany({
    where: { itineraryId: id },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });

  return NextResponse.json({ collaborators });
}
```

#### 3. Accept Invitation

**Route**: `POST /api/invites/[token]/accept`

```typescript
// src/app/api/invites/[token]/accept/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token } = await params;

  const share = await prisma.itineraryShare.findUnique({
    where: { token },
  });

  if (!share) {
    return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
  }

  // Update share to link to user
  await prisma.itineraryShare.update({
    where: { id: share.id },
    data: {
      userId: session.user.id,
      email: null,
      acceptedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, itineraryId: share.itineraryId });
}
```

### UI Components

#### Share Itinerary Modal

```typescript
// src/components/ShareItineraryModal.tsx
'use client';

import { useState } from 'react';

export function ShareItineraryModal({ itineraryId }: { itineraryId: string }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleInvite = async () => {
    setLoading(true);
    const response = await fetch(`/api/itineraries/${itineraryId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    
    const data = await response.json();
    setShareLink(data.inviteLink);
    setLoading(false);
  };

  return (
    <div className="modal">
      <h2>Share Itinerary</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email address"
      />
      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
      </select>
      <button onClick={handleInvite} disabled={loading}>
        Send Invitation
      </button>
      {shareLink && <p>Share link: {shareLink}</p>}
    </div>
  );
}
```

## PWA Implementation

### Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'terratraks-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/',
        '/dashboard',
        // Add critical assets
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### Manifest File

```json
// public/manifest.json
{
  "name": "TerraTraks - AI-Powered Trip Planning",
  "short_name": "TerraTraks",
  "description": "Plan your perfect adventure with AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2d5016",
  "theme_color": "#2d5016",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Offline Storage

```typescript
// src/lib/offline-storage.ts
import localForage from 'localforage';

export class OfflineStorage {
  static async saveItinerary(itinerary: any) {
    await localForage.setItem(`itinerary-${itinerary.id}`, itinerary);
  }

  static async getItinerary(id: string) {
    return await localForage.getItem(`itinerary-${id}`);
  }

  static async savePendingChange(change: any) {
    const pending = (await localForage.getItem('pending-changes')) || [];
    pending.push(change);
    await localForage.setItem('pending-changes', pending);
  }

  static async syncPendingChanges() {
    if (!navigator.onLine) return;

    const pending = (await localForage.getItem('pending-changes')) || [];
    
    for (const change of pending) {
      try {
        await fetch(change.url, {
          method: change.method,
          body: JSON.stringify(change.data),
        });
        // Remove from pending on success
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }

    await localForage.setItem('pending-changes', []);
  }
}
```

### Register Service Worker

```typescript
// src/app/layout.tsx (add to client component)
'use client';

useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('Service Worker registered');
    });
  }
}, []);
```

## Implementation Timeline

### Week 1-2: Database & API
- [ ] Update Prisma schema
- [ ] Run migrations
- [ ] Implement share API routes
- [ ] Implement invitation acceptance
- [ ] Test API endpoints

### Week 3-4: UI Components
- [ ] Share modal component
- [ ] Collaborators list
- [ ] Invitation email template
- [ ] Accept invitation page
- [ ] Permission checks in UI

### Week 5-6: PWA Setup
- [ ] Create service worker
- [ ] Create manifest file
- [ ] Implement offline storage
- [ ] Add install prompt
- [ ] Test offline functionality

### Week 7-8: Testing & Polish
- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Deployment

## Success Criteria

- [ ] Users can invite others via email
- [ ] Invited users can accept and access itinerary
- [ ] Permission system works (viewer/editor/owner)
- [ ] PWA installs on mobile devices
- [ ] Offline viewing works
- [ ] Offline changes sync when online
- [ ] No critical bugs in production

## Next Steps

1. Create feature branch: `git checkout -b feature/collaboration-pwa`
2. Start with database schema changes
3. Implement API routes
4. Build UI components
5. Test thoroughly
6. Deploy to staging
7. User testing
8. Deploy to production

Let's build! 🚀

