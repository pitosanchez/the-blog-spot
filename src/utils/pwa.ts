// PWA utilities for The Blog Spot
// Handles service worker registration, updates, and install prompts

import { analytics } from "./analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAUpdateInfo {
  isUpdateAvailable: boolean;
  showUpdatePrompt: () => void;
  skipWaiting: () => void;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: ((updateInfo: PWAUpdateInfo) => void)[] = [];
  private installCallbacks: ((canInstall: boolean) => void)[] = [];

  constructor() {
    this.initializePWA();
  }

  private initializePWA() {
    if (typeof window === "undefined") return;

    // Register service worker
    this.registerServiceWorker();

    // Listen for install prompt
    this.setupInstallPrompt();

    // Listen for app updates
    this.setupUpdateListener();

    // Track PWA usage
    this.trackPWAUsage();
  }

  private async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.log("📱 Service workers not supported");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register(
        "/the-blog-spot/sw.js",
        {
          scope: "/the-blog-spot/",
        }
      );

      this.registration = registration;

      console.log("📱 Service Worker registered successfully");
      analytics.track("pwa_service_worker_registered");

      // Check for updates
      registration.addEventListener("updatefound", () => {
        this.handleServiceWorkerUpdate(registration);
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        this.handleServiceWorkerMessage(event);
      });
    } catch (error) {
      console.error("📱 Service Worker registration failed:", error);
      analytics.track("pwa_service_worker_error", {
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("📱 Install prompt available");

      // Prevent the mini-infobar from appearing
      event.preventDefault();

      // Store the event for later use
      this.deferredPrompt = event as BeforeInstallPromptEvent;

      // Notify callbacks that install is available
      this.installCallbacks.forEach((callback) => callback(true));

      analytics.track("pwa_install_prompt_available");
    });

    // Track successful installation
    window.addEventListener("appinstalled", () => {
      console.log("📱 PWA installed successfully");
      this.deferredPrompt = null;

      analytics.track("pwa_installed");

      // Show thank you message
      this.showInstallSuccessMessage();
    });
  }

  private setupUpdateListener() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("📱 Service Worker controller changed");

      // Reload the page to get the latest version
      if (!navigator.serviceWorker.controller?.scriptURL.includes("sw.js")) {
        window.location.reload();
      }
    });
  }

  private handleServiceWorkerUpdate(registration: ServiceWorkerRegistration) {
    const newWorker = registration.installing;
    if (!newWorker) return;

    console.log("📱 New service worker installing");

    newWorker.addEventListener("statechange", () => {
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        console.log("📱 New service worker installed, update available");

        const updateInfo: PWAUpdateInfo = {
          isUpdateAvailable: true,
          showUpdatePrompt: () => this.showUpdatePrompt(),
          skipWaiting: () => this.skipWaiting(),
        };

        // Notify callbacks about available update
        this.updateCallbacks.forEach((callback) => callback(updateInfo));

        analytics.track("pwa_update_available");
      }
    });
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, payload } = event.data;

    switch (type) {
      case "CACHE_UPDATED":
        console.log("📱 Cache updated:", payload);
        break;
      case "OFFLINE_READY":
        console.log("📱 App ready for offline use");
        this.showOfflineReadyMessage();
        break;
      default:
        console.log("📱 Service Worker message:", event.data);
    }
  }

  private trackPWAUsage() {
    // Track if running as PWA
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isPWA = isStandalone || isInWebAppiOS;

    if (isPWA) {
      analytics.track("pwa_launched_standalone");
    }

    // Track display mode changes
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", (e) => {
        analytics.track("pwa_display_mode_changed", {
          is_standalone: e.matches,
        });
      });
  }

  // Public API

  /**
   * Check if PWA can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log("📱 No install prompt available");
      return false;
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();

      // Wait for user choice
      const choiceResult = await this.deferredPrompt.userChoice;

      analytics.track("pwa_install_prompt_shown", {
        user_choice: choiceResult.outcome,
      });

      if (choiceResult.outcome === "accepted") {
        console.log("📱 User accepted install prompt");
        this.deferredPrompt = null;
        return true;
      } else {
        console.log("📱 User dismissed install prompt");
        return false;
      }
    } catch (error) {
      console.error("📱 Error showing install prompt:", error);
      return false;
    }
  }

  /**
   * Register callback for install availability
   */
  onInstallAvailable(callback: (canInstall: boolean) => void) {
    this.installCallbacks.push(callback);

    // Call immediately if install is already available
    if (this.canInstall()) {
      callback(true);
    }
  }

  /**
   * Register callback for app updates
   */
  onUpdateAvailable(callback: (updateInfo: PWAUpdateInfo) => void) {
    this.updateCallbacks.push(callback);
  }

  /**
   * Check if running as PWA
   */
  isPWA(): boolean {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    return isStandalone || isInWebAppiOS;
  }

  /**
   * Get PWA installation status
   */
  getInstallStatus(): "not-supported" | "available" | "installed" {
    if (!("serviceWorker" in navigator)) {
      return "not-supported";
    }

    if (this.isPWA()) {
      return "installed";
    }

    if (this.canInstall()) {
      return "available";
    }

    return "not-supported";
  }

  /**
   * Force update the service worker
   */
  private skipWaiting() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt() {
    // This would typically show a toast or modal
    if (confirm("A new version of The Blog Spot is available. Update now?")) {
      this.skipWaiting();
    }
  }

  /**
   * Show install success message
   */
  private showInstallSuccessMessage() {
    // This would typically show a toast notification
    console.log("📱 Thank you for installing The Blog Spot!");
  }

  /**
   * Show offline ready message
   */
  private showOfflineReadyMessage() {
    // This would typically show a toast notification
    console.log("📱 The Blog Spot is ready for offline use!");
  }

  /**
   * Register for background sync
   */
  async registerBackgroundSync(tag: string, data: any) {
    if (
      !this.registration ||
      !("sync" in window.ServiceWorkerRegistration.prototype)
    ) {
      console.log("📱 Background sync not supported");
      return false;
    }

    try {
      // Store data for sync
      const submissions = JSON.parse(localStorage.getItem(tag) || "[]");
      submissions.push({
        id: Date.now().toString(),
        data,
        timestamp: Date.now(),
      });
      localStorage.setItem(tag, JSON.stringify(submissions));

      // Register sync
      await (this.registration as any).sync.register(tag);

      analytics.track("pwa_background_sync_registered", { tag });
      return true;
    } catch (error) {
      console.error("📱 Background sync registration failed:", error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.log("📱 Notifications not supported");
      return "denied";
    }

    const permission = await Notification.requestPermission();

    analytics.track("pwa_notification_permission_requested", {
      permission,
    });

    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || !("PushManager" in window)) {
      console.log("📱 Push notifications not supported");
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ""
        ),
      });

      analytics.track("pwa_push_subscription_created");
      return subscription;
    } catch (error) {
      console.error("📱 Push subscription failed:", error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Convenience functions
export const canInstallPWA = () => pwaManager.canInstall();
export const installPWA = () => pwaManager.showInstallPrompt();
export const isPWA = () => pwaManager.isPWA();
export const onPWAInstallAvailable = (
  callback: (canInstall: boolean) => void
) => pwaManager.onInstallAvailable(callback);
export const onPWAUpdateAvailable = (
  callback: (updateInfo: PWAUpdateInfo) => void
) => pwaManager.onUpdateAvailable(callback);

export default pwaManager;
