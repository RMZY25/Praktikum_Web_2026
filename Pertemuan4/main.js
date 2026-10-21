// File: main.js
// Integrasi Logika Data dan Render ke Elemen DOM

// Data awal
let projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// State untuk filter dan pencarian
let currentCategory = "Semua";
let searchQuery = "";

// Helper function untuk format mata uang Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};

// Fungsi untuk memperbarui kartu statistik
const updateStats = (dataList) => {
    const totalProjects = dataList.length;
    const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = dataList.filter(item => item.completed).length;

    document.getElementById("stat-total-projects").textContent = totalProjects;
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
    document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Fungsi untuk merender daftar proyek ke dalam DOM
const renderProjects = (dataList) => {
    const container = document.getElementById("project-list");
    if (!container) return;

    // Tampilan jika tidak ada proyek yang cocok
    if (dataList.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #64748b; padding: 20px;">
                Tidak ada proyek yang sesuai dengan pencarian/filter.
            </p>`;
        return;
    }

    // Membuat string HTML dari array proyek
    const htmlString = dataList.map(proj => {
        const badgeClass = proj.completed ? "badge-success" : "badge-pending";
        const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
        const toggleText = proj.completed ? "Tandai Proses" : "Tandai Selesai";

        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">${proj.category}</span>
                    <h4>${proj.title}</h4>
                    <p class="project-budget">${formatRupiah(proj.budget)}</p>
                </div>
                <div class="card-actions">
                    <span class="badge ${badgeClass}">${statusText}</span>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button class="btn-action btn-toggle" onclick="toggleStatus(${proj.id})">${toggleText}</button>
                        <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = htmlString;
};

// Fungsi untuk menerapkan semua filter (kategori & pencarian) dan merender
const applyFiltersAndRender = () => {
    let filteredData = projects;

    // 1. Filter berdasarkan kategori
    if (currentCategory !== "Semua") {
        filteredData = filteredData.filter(p => p.category === currentCategory);
    }

    // 2. Filter berdasarkan pencarian judul (case-insensitive)
    if (searchQuery.trim() !== "") {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(p => p.title.toLowerCase().includes(lowerQuery));
    }

    // Render data yang sudah difilter
    renderProjects(filteredData);
    
    // Update statistik berdasarkan data yang terfilter (atau gunakan `projects` jika ingin statistik global)
    updateStats(projects); 
};

// Fungsi Aksi: Toggle Status (Fitur 3a)
window.toggleStatus = (id) => {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
        projects[projectIndex].completed = !projects[projectIndex].completed;
        applyFiltersAndRender();
    }
};

// Fungsi Aksi: Hapus Proyek (Fitur 3b)
window.deleteProject = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
        projects = projects.filter(p => p.id !== id);
        applyFiltersAndRender();
    }
};

// Event listener saat dokumen HTML selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Render data awal
    applyFiltersAndRender();

    // --- Fitur 1: Form Submission ---
    const form = document.getElementById("project-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Mencegah reload halaman

        // Ambil nilai input
        const title = document.getElementById("input-title").value.trim();
        const category = document.getElementById("input-category").value;
        const budget = parseFloat(document.getElementById("input-budget").value);
        const completed = document.getElementById("input-completed").checked;

        // Validasi
        if (!title || budget <= 0 || !category) {
            alert("Mohon isi semua field dengan benar. Judul tidak boleh kosong dan anggaran harus > 0.");
            return;
        }

        // Buat objek proyek baru
        const newProject = {
            id: Date.now(), // ID unik berdasarkan timestamp
            title: title,
            category: category,
            budget: budget,
            completed: completed
        };

        // Tambahkan ke array
        projects.push(newProject);

        // Reset form
        form.reset();

        // Render ulang
        applyFiltersAndRender();
    });

    // --- Fitur 2: Live Search ---
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        applyFiltersAndRender();
    });

    // --- Logika untuk tombol filter kategori ---
    const filterButtons = document.querySelectorAll(".btn-filter");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(b => b.classList.remove("active"));
            
            // Tambahkan kelas 'active' ke tombol yang diklik
            e.target.classList.add("active");

            // Update state kategori
            currentCategory = e.target.getAttribute("data-category");
            
            // Render ulang dengan filter baru
            applyFiltersAndRender();
        });
    });
});