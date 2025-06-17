"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { slugify } from '@/utils/slugify';
import styles from './Header.module.css';
import { supabase } from '@/supabaseClient';

type District = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

type HeaderProps = {
  showSearch?: boolean;
};

export default function Header({ showSearch = false }: HeaderProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeTab, setActiveTab] = useState("bán");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/districts")
      .then((response) => response.json())
      .then((data: District[]) => setDistricts(data));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/projects?district=${selectedDistrict}`)
        .then((response) => response.json())
        .then((data: Project[]) => setProjects(data));
    }
  }, [selectedDistrict]);

  const handleSearch = async () => {
    console.log('Search initiated'); // Debugging log

    let query = supabase.from('posts').select('*, districts(name)');

    if (activeTab) {
        query = query.eq('purpose', activeTab === 'bán' ? 'Bán' : 'Cho thuê');
        console.log('Filter by purpose:', activeTab === 'bán' ? 'Bán' : 'Cho thuê');
    }

    if (selectedDistrict) {
        const district = districts.find(d => d.id === selectedDistrict);
        if (district) {
            query = query.eq('districts.name', district.name);
            console.log('Filter by district:', district.name);
        }
    }

    if (selectedProject) {
        const project = projects.find(p => p.id === selectedProject);
        if (project) {
            query = query.eq('project_name', project.name);
            console.log('Filter by project:', project.name);
        }
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching search results:', error);
    } else {
        console.log('Fetched data:', data);
        // Assuming you want to navigate to the search results page
        const queryParams = new URLSearchParams();
        queryParams.set('loai', activeTab === 'bán' ? 'ban' : 'thue');
        if (selectedDistrict) {
          const district = districts.find(d => d.id === selectedDistrict);
          if (district) {
            queryParams.set('quan', slugify(district.name));
          }
        }
        if (selectedProject) {
          const project = projects.find(p => p.id === selectedProject);
          if (project) {
            queryParams.set('duan', slugify(project.name));
          }
        }
        const url = `/tim-kiem?${queryParams.toString()}`;
        router.push(url);
    }
  };

  return (
    <header className={`${styles.header} ${showSearch ? styles.twoRow : ''}`}>
      <div className={styles.topRow}>
        <div className={styles.logo}>bds29.vn</div>
        <div className={styles.headerRight}>
          <button className={styles.postButton}>Đăng tin</button>
          <button className={styles.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            &#9776;
          </button>
        </div>
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
          <nav className={styles.mobileNav}>
            <Link href="/">Trang chủ</Link>
            <Link href="/can-ho-ban">Căn hộ bán</Link>
            <Link href="/can-ho-cho-thue">Căn hộ cho thuê</Link>
            <Link href="/du-an">Dự án</Link>
            <Link href="/tin-tuc">Tin tức</Link>
          </nav>
          <div className={styles.mobileActions}>
            <button className={styles.loginButton}>Đăng nhập</button>
          </div>
        </div>
        <nav className={styles.navbar}>
          <Link href="/">Trang chủ</Link>
          <Link href="/can-ho-ban">Căn hộ bán</Link>
          <Link href="/can-ho-cho-thue">Căn hộ cho thuê</Link>
          <Link href="/du-an">Dự án</Link>
          <Link href="/tin-tuc">Tin tức</Link>
        </nav>
        <div className={styles.actions}>
          <button className={styles.loginButton}>Đăng nhập</button>
        </div>
      </div>
      {showSearch && (
        <div className={styles.bottomRow}>
          <div className={styles.searchContainer}>
            <div className={styles.searchTabs}>
              <button
                className={activeTab === "bán" ? styles.activeTab : ""}
                onClick={() => setActiveTab("bán")}
              >
                Căn hộ bán
              </button>
              <button
                className={activeTab === "thuê" ? styles.activeTab : ""}
                onClick={() => setActiveTab("thuê")}
              >
                Căn hộ cho thuê
              </button>
            </div>
            <div className={styles.searchFields}>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={!selectedDistrict}
              >
                <option value="">Dự án</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select>
                <option value="">Diện tích</option>
                <option value="<50">Dưới 50m²</option>
                <option value="50-100">50-100m²</option>
                <option value="100-150">100-150m²</option>
                <option value=">150">Trên 150m²</option>
              </select>

              <select>
                <option value="">Số phòng ngủ</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>

              <select>
                <option value="">Nội thất</option>
                <option value="Có">Có nội thất</option>
                <option value="Không">Không nội thất</option>
              </select>

              <button className={styles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}