"use client";

import { useEffect, useState, useMemo } from "react";
import {
  apiGetCars,
  apiCreateCar,
  apiUpdateCar,
  apiDeleteCar,
  apiToggleFeatured,
  apiGetAnalytics,
  apiGetInquiries,
  apiUpdateInquiryStatus,
  apiDeleteInquiry,
  apiGetSellRequests,
  apiUpdateSellRequestStatus,
  apiDeleteSellRequest,
  apiGetTestDrives,
  apiUpdateTestDriveStatus,
  apiDeleteTestDrive,
  DashboardStats,
  InquiryItem,
  SellRequestItem,
  TestDriveItem,
} from "@/lib/api";
import { Car as CarType } from "@/types/car";
import {
  AdminGuard,
  AdminHeader,
  AdminSidebar,
  AdminOverview,
  AdminCars,
  AdminInquiries,
  AdminSellRequests,
  AdminTestDrives,
  AdminUsers,
  AdminTabType,
} from "@/components/admin";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Data States
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [sellRequests, setSellRequests] = useState<SellRequestItem[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveItem[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [analyticsData, carsData, inqData, sellData, tdData] = await Promise.all([
        apiGetAnalytics(),
        apiGetCars(),
        apiGetInquiries(),
        apiGetSellRequests(),
        apiGetTestDrives(),
      ]);

      setAnalytics(analyticsData);
      setCars(carsData);
      setInquiries(inqData);
      setSellRequests(sellData);
      setTestDrives(tdData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      showToast("Failed to connect to backend server. Using cached data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Cars
  const handleAddCar = async (carData: any) => {
    try {
      const newCar = await apiCreateCar(carData);
      setCars((prev) => [newCar, ...prev]);
      showToast("Vehicle created successfully!");
    } catch (error: any) {
      showToast(error.message || "Failed to create vehicle", "error");
    }
  };

  const handleUpdateCar = async (id: string, carData: any) => {
    try {
      const updated = await apiUpdateCar(id, carData);
      setCars((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast("Vehicle updated successfully!");
    } catch (error: any) {
      showToast(error.message || "Failed to update vehicle", "error");
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle from inventory?")) return;
    try {
      await apiDeleteCar(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
      showToast("Vehicle deleted from inventory.");
    } catch (error: any) {
      showToast(error.message || "Failed to delete vehicle", "error");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const updated = await apiToggleFeatured(id);
      setCars((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast(`Vehicle ${updated.featured ? "marked as featured" : "unmarked as featured"}.`);
    } catch (error: any) {
      showToast(error.message || "Failed to toggle featured status", "error");
    }
  };

  // Handlers for Inquiries
  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    try {
      const updated = await apiUpdateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
      showToast(`Inquiry status updated to ${status}.`);
    } catch (error: any) {
      showToast(error.message || "Failed to update status", "error");
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Delete this inquiry record?")) return;
    try {
      await apiDeleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      showToast("Inquiry record deleted.");
    } catch (error: any) {
      showToast(error.message || "Failed to delete inquiry", "error");
    }
  };

  // Handlers for Sell Requests
  const handleUpdateSellStatus = async (id: number, status: string) => {
    try {
      const updated = await apiUpdateSellRequestStatus(id, status);
      setSellRequests((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(`Sell request status updated to ${status}.`);
    } catch (error: any) {
      showToast(error.message || "Failed to update sell request", "error");
    }
  };

  const handleDeleteSellRequest = async (id: number) => {
    if (!confirm("Delete this sell submission record?")) return;
    try {
      await apiDeleteSellRequest(id);
      setSellRequests((prev) => prev.filter((s) => s.id !== id));
      showToast("Sell request deleted.");
    } catch (error: any) {
      showToast(error.message || "Failed to delete sell request", "error");
    }
  };

  // Handlers for Test Drives
  const handleUpdateTestDriveStatus = async (id: number, status: string) => {
    try {
      const updated = await apiUpdateTestDriveStatus(id, status);
      setTestDrives((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Appointment status updated to ${status}.`);
    } catch (error: any) {
      showToast(error.message || "Failed to update appointment", "error");
    }
  };

  const handleDeleteTestDrive = async (id: number) => {
    if (!confirm("Cancel & delete this test drive appointment?")) return;
    try {
      await apiDeleteTestDrive(id);
      setTestDrives((prev) => prev.filter((t) => t.id !== id));
      showToast("Test drive appointment removed.");
    } catch (error: any) {
      showToast(error.message || "Failed to delete test drive", "error");
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f6f6f4]">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-5 ${
              toast.type === "success" ? "bg-neutral-900 border border-neutral-700" : "bg-red-600"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <AdminHeader activeTab={activeTab} onRefresh={loadAllData} loading={loading} />

        {/* Main Admin Workspace */}
        <div className="container py-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              counts={{
                cars: cars.length,
                inquiries: inquiries.filter((i) => i.status === "Pending").length,
                sellRequests: sellRequests.filter((s) => s.status === "Under Review").length,
                testDrives: testDrives.filter((t) => t.status === "Confirmed").length,
              }}
            />

            {/* Content Area */}
            <main className="min-w-0">
              {activeTab === "overview" && (
                <AdminOverview
                  analytics={analytics}
                  cars={cars}
                  inquiries={inquiries}
                  sellRequests={sellRequests}
                  testDrives={testDrives}
                  setActiveTab={setActiveTab}
                  onUpdateInquiryStatus={handleUpdateInquiryStatus}
                  onUpdateTestDriveStatus={handleUpdateTestDriveStatus}
                  onUpdateSellStatus={handleUpdateSellStatus}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}

              {activeTab === "cars" && (
                <AdminCars
                  cars={cars}
                  onAddCar={handleAddCar}
                  onUpdateCar={handleUpdateCar}
                  onDeleteCar={handleDeleteCar}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}

              {activeTab === "inquiries" && (
                <AdminInquiries
                  inquiries={inquiries}
                  onUpdateStatus={handleUpdateInquiryStatus}
                  onDelete={handleDeleteInquiry}
                />
              )}

              {activeTab === "sell_requests" && (
                <AdminSellRequests
                  sellRequests={sellRequests}
                  onUpdateStatus={handleUpdateSellStatus}
                  onDelete={handleDeleteSellRequest}
                />
              )}

              {activeTab === "test_drives" && (
                <AdminTestDrives
                  testDrives={testDrives}
                  onUpdateStatus={handleUpdateTestDriveStatus}
                  onDelete={handleDeleteTestDrive}
                />
              )}

              {activeTab === "users" && <AdminUsers />}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
