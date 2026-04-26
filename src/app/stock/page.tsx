
'use client';

import { useEffect, useState } from 'react';

interface Stock {
  id: string;
  quantity: number;
}

interface Material {
  id: string;
  name: string;
  barcode: string;
  unit: 'YARD' | 'PCS';
  stock: Stock | null;
}

export default function StockPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  
  // Add Material Form state
  const [addFormData, setAddFormData] = useState({
    name: '',
    barcode: '',
    unit: 'YARD',
    initialQuantity: '0',
  });
  const [addFormError, setAddFormError] = useState<string | null>(null);
  
  // Update Stock Form state
  const [updateFormData, setUpdateFormData] = useState({
    quantity: '0',
  });
  const [updateFormError, setUpdateFormError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stock');
      if (!response.ok) {
        throw new Error('Gagal memuat data stok');
      }
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah material');
      }

      await fetchMaterials();
      setShowAddModal(false);
      setAddFormData({
        name: '',
        barcode: '',
        unit: 'YARD',
        initialQuantity: '0',
      });
    } catch (err) {
      setAddFormError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;
    
    setUpdateFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/stock/${selectedMaterial.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate stok');
      }

      await fetchMaterials();
      setShowUpdateModal(false);
      setSelectedMaterial(null);
    } catch (err) {
      setUpdateFormError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openUpdateModal = (material: Material) => {
    setSelectedMaterial(material);
    setUpdateFormData({
      quantity: material.stock?.quantity.toString() || '0',
    });
    setShowUpdateModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Stok</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Tambah Material
        </button>
      </div>

      {isLoading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nama Material</th>
                <th className="py-3 px-6 text-left">Barcode</th>
                <th className="py-3 px-6 text-center">Satuan</th>
                <th className="py-3 px-6 text-center">Jumlah Stok</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{material.name}</td>
                  <td className="py-3 px-6 text-left">{material.barcode}</td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-xs">
                      {material.unit}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center font-bold">
                    {material.stock?.quantity || 0}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button 
                      onClick={() => openUpdateModal(material)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Update Stok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah Material */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tambah Material Baru</h3>
              <form className="mt-4 text-left" onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nama Material</label>
                  <input
                    type="text"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    value={addFormData.barcode}
                    onChange={handleAddInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Satuan</label>
                  <select
                    name="unit"
                    value={addFormData.unit}
                    onChange={handleAddInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="YARD">YARD</option>
                    <option value="PCS">PCS</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Stok Awal</label>
                  <input
                    type="number"
                    step="0.01"
                    name="initialQuantity"
                    value={addFormData.initialQuantity}
                    onChange={handleAddInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                {addFormError && <p className="text-red-500 text-xs italic mb-4">{addFormError}</p>}
                
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Stok */}
      {showUpdateModal && selectedMaterial && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Update Stok: {selectedMaterial.name}</h3>
              <form className="mt-4 text-left" onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Jumlah Stok ({selectedMaterial.unit})</label>
                  <input
                    type="number"
                    step="0.01"
                    name="quantity"
                    value={updateFormData.quantity}
                    onChange={handleUpdateInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                {updateFormError && <p className="text-red-500 text-xs italic mb-4">{updateFormError}</p>}
                
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isSubmitting ? 'Mengupdate...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
