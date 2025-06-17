"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import styles from './SearchPage.module.css';
import { slugify } from '@/utils/slugify';
import headerStyles from "@/components/Header.module.css";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFurniture, setSelectedFurniture] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const propertyType = searchParams.get('loai');
  const district = searchParams.get('quan');
  const project = searchParams.get('duan');

  useEffect(() => {
    console.log('Search page useEffect triggered with:', { propertyType, district, project });

    const fetchResults = async () => {
      console.log('Fetching results from Supabase...');

      setLoading(true);
      let query = supabase.from('posts').select('*, districts(name)');

      if (propertyType) {
        query = query.eq('purpose', propertyType === 'ban' ? 'Bán' : 'Cho thuê');
        console.log('Filter by purpose:', propertyType === 'ban' ? 'Bán' : 'Cho thuê');
      }
      if (district) {
        query = query.eq('districts.name', district.replace(/-/g, ' '));
        console.log('Filter by district:', district.replace(/-/g, ' '));
      }
      if (project) {
        query = query.eq('project_name', project.replace(/-/g, ' '));
        console.log('Filter by project:', project.replace(/-/g, ' '));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        console.log('Fetched data:', data);
        setResults(data);
      }
      setLoading(false);
    };

    fetchResults();
  }, [propertyType, district, project]);

  useEffect(() => {
    const fetchResults = async () => {
      const filters = JSON.parse(sessionStorage.getItem('searchFilters') || '{}');

      const { data, error } = await supabase.rpc('search_posts', filters);

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        console.log('Fetched data:', data);
        setResults(data);
      }
    };

    fetchResults();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    queryParams.set('loai', propertyType === 'ban' ? 'ban' : 'thue');

    if (district) {
        queryParams.set('quan', district.replace(/-/g, ' '));
    }

    if (project) {
        queryParams.set('duan', project.replace(/-/g, ' '));
    }

    const url = `/tim-kiem?${queryParams.toString()}`;
    router.push(url);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          <h1>Trang kết quả tìm kiếm</h1>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <div className={styles.resultsList}>
              {results.map((post) => (
                <Link href={`/tin-dang/${post.slug}`} key={post.id} className={styles.propertyLink}>
                  <div className={styles.propertyCard}>
                    <img src={post.avatar_image} alt={post.title} />
                    <div className={styles.propertyInfo}>
                      <h3>{post.title}</h3>
                      <p className={styles.price}>
                        {post.purpose === 'Bán'
                          ? `${(post.price / 1000000000).toFixed(2)} tỷ`
                          : `${(post.price / 1000000).toFixed(0)} triệu/tháng`}
                      </p>
                      <p className={styles.details}>{post.area}m² - {post.bedrooms} PN</p>
                      <p className={styles.location}>{post.project_name}, {post.districts.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
        <aside className={styles.sidebar}>
          <div className={styles.filterBox}>
            <h3>Lọc theo giá</h3>
            <ul>
              <li><Link href="#">Dưới 2 tỷ</Link></li>
              <li><Link href="#">2 - 3 tỷ</Link></li>
              <li><Link href="#">3 - 5 tỷ</Link></li>
              <li><Link href="#">5 - 7 tỷ</Link></li>
              <li><Link href="#">7 - 10 tỷ</Link></li>
              <li><Link href="#">Trên 10 tỷ</Link></li>
            </ul>
          </div>
          <div className={styles.filterBox}>
            <h3>Lọc theo số phòng ngủ</h3>
            <ul>
              <li><Link href="#">Studio</Link></li>
              <li><Link href="#">1 Phòng Ngủ</Link></li>
              <li><Link href="#">2 Phòng Ngủ</Link></li>
              <li><Link href="#">3 Phòng Ngủ</Link></li>
              <li><Link href="#">4 Phòng Ngủ</Link></li>
            </ul>
          </div>
          <div className={styles.filterBox}>
            <h3>Lọc theo diện tích</h3>
            <ul>
              <li><Link href="#">&lt;= 30 m²</Link></li>
              <li><Link href="#">30-50 m²</Link></li>
              <li><Link href="#">50-80 m²</Link></li>
              <li><Link href="#">80-100 m²</Link></li>
              <li><Link href="#">100-150 m²</Link></li>
              <li><Link href="#">150-200 m²</Link></li>
              <li><Link href="#">200-250 m²</Link></li>
              <li><Link href="#">250-300 m²</Link></li>
              <li><Link href="#">300-500 m²</Link></li>
              <li><Link href="#">&gt;= 500 m²</Link></li>
            </ul>
          </div>
          <div className={styles.filterBox}>
            <h3>Chung cư khu vực Hà Nội</h3>
            <ul>
              <li><Link href="#">Cầu Giấy (895)</Link></li>
              <li><Link href="#">Nam Từ Liêm (705)</Link></li>
              <li><Link href="#">Bắc Từ Liêm (517)</Link></li>
              <li><Link href="#">Tây Hồ (72)</Link></li>
              <li><Link href="#">Thanh Xuân (69)</Link></li>
            </ul>
          </div>
          <div className={styles.filterBox}>
            <h3>CĂN HỘ THEO KHU VỰC</h3>
            <ul>
              <li><Link href="#">Căn Hộ Khu Vực Cầu Giấy</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Mỹ Đình</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Trung Kính</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Mễ Trì</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Phạm Hùng</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Thành Phố Giao Lưu</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Phạm Văn Đồng</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Hoàng Quốc Việt</Link></li>
              <li><Link href="#">Căn Hộ Khu Vực Hồ Tùng Mậu</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

type District = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

type Post = {
  id: string;
  slug: string;
  avatar_image: string;
  title: string;
  purpose: string;
  price: number;
  area: number;
  bedrooms: number;
  project_name: string;
  districts: {
    name: string;
  };
};


export default function SearchPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [results, setResults] = useState<Post[]>([]); // Define results state
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeTab, setActiveTab] = useState("bán");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedFurniture, setSelectedFurniture] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/districts");
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedDistrict) {
        try {
          const response = await fetch(`/api/projects?district=${selectedDistrict}`);
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();
  }, [selectedDistrict]);

  const handleSearch = async () => {
    console.log('Search initiated');

    const filters = {
      search_purpose: activeTab === 'bán' ? 'Bán' : 'Cho thuê',
      search_district_id: selectedDistrict || null,
      search_project_id: selectedProject || null,
      search_area: selectedArea || null,
      search_bedrooms: selectedBedrooms || null,
      search_furniture: selectedFurniture || null,
    };

    // Log search values
    console.log('Search filters:', filters);

    // Save search values to session storage
    sessionStorage.setItem('searchFilters', JSON.stringify(filters));

    const { data, error } = await supabase.rpc('search_posts', filters);

    if (error) {
      console.error('Error fetching search results:', error);
    } else {
      console.log('Fetched data:', data);
      setResults(data); // Update the results state with the new data
      setLoading(false); // Ensure loading state is updated
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={`${headerStyles.header} ${headerStyles.twoRow}`}>
        <div className={headerStyles.topRow}>
          <div className={headerStyles.logo}>bds29.vn</div>
          <div className={headerStyles.headerRight}>
            <button className={headerStyles.postButton}>Đăng tin</button>
            <button className={headerStyles.menuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              &#9776;
            </button>
          </div>
          <div className={`${headerStyles.mobileMenu} ${isMenuOpen ? headerStyles.open : ""}`}>
            <nav className={headerStyles.mobileNav}>
              <Link href="/">Trang chủ</Link>
              <Link href="/can-ho-ban">Căn hộ bán</Link>
              <Link href="/can-ho-cho-thue">Căn hộ cho thuê</Link>
              <Link href="/du-an">Dự án</Link>
              <Link href="/tin-tuc">Tin tức</Link>
            </nav>
            <div className={headerStyles.mobileActions}>
              <button className={headerStyles.loginButton}>Đăng nhập</button>
            </div>
          </div>
          <nav className={headerStyles.navbar}>
            <Link href="/">Trang chủ</Link>
            <Link href="/can-ho-ban">Căn hộ bán</Link>
            <Link href="/can-ho-cho-thue">Căn hộ cho thuê</Link>
            <Link href="/du-an">Dự án</Link>
            <Link href="/tin-tuc">Tin tức</Link>
          </nav>
          <div className={headerStyles.actions}>
            <button className={headerStyles.loginButton}>Đăng nhập</button>
          </div>
        </div>
        <div className={headerStyles.bottomRow}>
          <div className={headerStyles.searchContainer}>
            <div className={headerStyles.searchTabs}>
              <button
                className={activeTab === "bán" ? headerStyles.activeTab : ""}
                onClick={() => setActiveTab("bán")}
              >
                Căn hộ bán
              </button>
              <button
                className={activeTab === "thuê" ? headerStyles.activeTab : ""}
                onClick={() => setActiveTab("thuê")}
              >
                Căn hộ cho thuê
              </button>
            </div>
            <div className={headerStyles.searchFields}>
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
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  sessionStorage.setItem('selectedArea', e.target.value);
                }}
              >
                <option value="">Diện tích</option>
                <option value="<50">Dưới 50m²</option>
                <option value="50-100">50-100m²</option>
                <option value="100-150">100-150m²</option>
                <option value=">150">Trên 150m²</option>
              </select>

              <select
                value={selectedBedrooms}
                onChange={(e) => {
                  setSelectedBedrooms(e.target.value);
                  sessionStorage.setItem('selectedBedrooms', e.target.value);
                }}
              >
                <option value="">Số phòng ngủ</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>

              <select
                value={selectedFurniture}
                onChange={(e) => {
                  setSelectedFurniture(e.target.value);
                  sessionStorage.setItem('selectedFurniture', e.target.value);
                }}
              >
                <option value="">Nội thất</option>
                <option value="Có">Có nội thất</option>
                <option value="Không">Không nội thất</option>
              </select>

              <button className={headerStyles.searchButton} onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </div>
        </div>
      </header>
      <main className={styles.mainContent}>
        <h1>Kết quả tìm kiếm</h1>
        <SearchContent />
      </main>
    </div>
  );
}