
'use client';

import { useEffect, useState } from 'react';

// Definisikan tipe data untuk proyek agar lebih aman
interface Project {
  id: string;
  clientName: string;
  projectName: string;
  projectValue: number;
  duration: number;
  status: string;
  itemsCompleted: number;
  itemsTarget: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Gagal memuat data proyek');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Proyek</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Tambah Proyek
        </button>
      </div>

      {isLoading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nama Klien</th>
                <th className="py-3 px-6 text-left">Nama Proyek</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Progres</th>
                <th className="py-3 px-6 text-right">Nilai Proyek</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{project.clientName}</td>
                  <td className="py-3 px-6 text-left">{project.projectName}</td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {project.itemsCompleted} / {project.itemsTarget}
                  </td>
                  <td className="py-3 px-6 text-right">Rp {project.projectValue.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
