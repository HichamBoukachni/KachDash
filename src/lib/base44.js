export async function UploadFile({ file }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ file_url: URL.createObjectURL(file) });
    }, 1000);
  });
}

export async function ExtractDataFromUploadedFile({ file_url }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        output: {
          trades: [
            {
              ticket: "123456",
              symbol: "EURUSD",
              entry_date: new Date().toISOString(),
              exit_date: new Date().toISOString(),
              side: "buy",
              entry_price: 1.085,
              exit_price: 1.09,
              quantity: 1.0,
              profit_loss: 50,
              commission: 0,
              pips: 50,
            },
          ],
        },
      });
    }, 1200);
  });
}
