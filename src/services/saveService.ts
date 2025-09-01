// Service for handling saved items and notifications
import { MediaAnalysisResponse } from '@/lib/api';

export interface SavedItem extends MediaAnalysisResponse {
  savedAt: Date;
}

export interface NotificationSubscription {
  itemId: string;
  title: string;
  subscribedAt: Date;
}

export class SaveService {
  private static readonly SAVED_ITEMS_KEY = 'media_literacy_saved_items';
  private static readonly NOTIFICATIONS_KEY = 'media_literacy_notifications';

  static saveItem(item: MediaAnalysisResponse): void {
    const savedItems = this.getSavedItems();
    const savedItem: SavedItem = {
      ...item,
      savedAt: new Date()
    };
    
    // Prevent duplicates
    const exists = savedItems.find(saved => saved.id === item.id);
    if (!exists) {
      savedItems.unshift(savedItem);
      localStorage.setItem(this.SAVED_ITEMS_KEY, JSON.stringify(savedItems));
    }
  }

  static getSavedItems(): SavedItem[] {
    try {
      const items = localStorage.getItem(this.SAVED_ITEMS_KEY);
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  }

  static deleteSavedItem(itemId: string): void {
    const savedItems = this.getSavedItems();
    const filtered = savedItems.filter(item => item.id !== itemId);
    localStorage.setItem(this.SAVED_ITEMS_KEY, JSON.stringify(filtered));
  }

  static subscribeToUpdates(item: MediaAnalysisResponse): void {
    const subscriptions = this.getNotificationSubscriptions();
    const subscription: NotificationSubscription = {
      itemId: item.id,
      title: item.title,
      subscribedAt: new Date()
    };
    
    const exists = subscriptions.find(sub => sub.itemId === item.id);
    if (!exists) {
      subscriptions.push(subscription);
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(subscriptions));
    }
  }

  static getNotificationSubscriptions(): NotificationSubscription[] {
    try {
      const subs = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return subs ? JSON.parse(subs) : [];
    } catch {
      return [];
    }
  }

  static shareItem(item: MediaAnalysisResponse): void {
    const shareData = {
      title: `Media Analysis: ${item.title}`,
      text: `Check out this media bias analysis - ${item.analysis.biasLevel} with ${item.confidence}% credibility.`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData);
    } else {
      // Fallback to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        // Could show a toast here
      });
    }
  }
}