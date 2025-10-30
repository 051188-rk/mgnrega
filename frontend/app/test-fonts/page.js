export default function TestFonts() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Font Loading Test</h1>
      
      <div className="space-y-6 w-full max-w-2xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Poppins Regular (400)</h2>
          <p className="text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Poppins Semibold (600)</h2>
          <p className="text-lg font-semibold">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Poppins Bold (700)</h2>
          <p className="text-lg font-bold">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>
      </div>
    </div>
  );
}
