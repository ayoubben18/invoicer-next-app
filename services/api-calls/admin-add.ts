// services/stockManagementVoiceService.ts
interface StockManagementResponse {
  response: string;
  // Add other specific response properties
}

export async function processStockManagementVoice(
  audioBlob: Blob
): Promise<StockManagementResponse> {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("type", "stock_management");

  const response = await fetch("/api/add-stock", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process voice recording");
  }

  return response.json();
}
