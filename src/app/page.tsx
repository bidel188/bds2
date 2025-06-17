"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { slugify } from '../utils/slugify';
import Image from "next/image";
import styles from "./page.module.css";
import { supabase } from "@/supabaseClient";
import Header from "@/components/Header";

type District = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

type Post = {
  id: number;
  title: string;
  slug: string;
  price: number;
  area: number;
  bedrooms: number;
  location: string;
  avatar_image: string;
  purpose: string;
  project_name: string;
  district_id: number;
  districts: { name: string };
};

type FeaturedProject = {
  id: number;
  name: string;
  slug: string;
  description: string;
  district_id: number;
  districts: { name: string };
};

type DistrictWithPostCount = {
  id: string;
  name: string;
  post_count: number;
};

export default function Home() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [latestSalePosts, setLatestSalePosts] = useState<Post[]>([]);
  const [latestRentPosts, setLatestRentPosts] = useState<Post[]>([]);
  const [featuredProjectsData, setFeaturedProjectsData] = useState<FeaturedProject[]>([]);
  const [districtsWithPostCount, setDistrictsWithPostCount] = useState<DistrictWithPostCount[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeTab, setActiveTab] = useState("bán");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const projectsPerSlide = 4;
  const totalSlides = Math.ceil(featuredProjectsData.length / projectsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    // Fetch districts from the database
    fetch("/api/districts")
      .then((response) => response.json())
      .then((data: District[]) => setDistricts(data));
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      // Fetch projects based on selected district
      fetch(`/api/projects?district=${selectedDistrict}`)
        .then((response) => response.json())
        .then((data: Project[]) => setProjects(data));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch posts
      const { data: saleData, error: saleError } = await supabase
        .from('posts')
        .select('*, districts(name)')
        .eq('purpose', 'Bán')
        .order('created_at', { ascending: false })
        .limit(8);
      if (saleError) console.error('Error fetching sale posts:', saleError);
      else setLatestSalePosts(saleData as any[]);

      const { data: rentData, error: rentError } = await supabase
        .from('posts')
        .select('*, districts(name)')
        .eq('purpose', 'Cho thuê')
        .order('created_at', { ascending: false })
        .limit(8);
      if (rentError) console.error('Error fetching rent posts:', rentError);
      else setLatestRentPosts(rentData as any[]);

      // Fetch featured projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*, districts(name)')
        .order('created_at', { ascending: false })
        .limit(12);
      if (projectsError) console.error('Error fetching projects:', projectsError);
      else setFeaturedProjectsData(projectsData as FeaturedProject[]);

      // Fetch districts with post count
      const { data: districtsData, error: districtsError } = await supabase
        .from('districts')
        .select('id, name');
      if (districtsError) {
        console.error('Error fetching districts:', districtsError);
      } else {
        const counts = await Promise.all(
          districtsData.map(async (district) => {
            const { count, error: countError } = await supabase
              .from('posts')
              .select('*', { count: 'exact', head: true })
              .eq('district_id', district.id);
            if (countError) console.error(`Error counting posts for district ${district.id}:`, countError);
            return { ...district, post_count: count || 0 };
          })
        );
        setDistrictsWithPostCount(counts as DistrictWithPostCount[]);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
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
  };

  return (
    <div>
      <Header />
      <main>
        <section className={styles.searchSection}>
          <div className={styles.searchBackground}></div>
          <button className={styles.mobileSearchButton} onClick={() => setIsSearchOpen(true)}>
            Tìm kiếm bất động sản
          </button>
          {isSearchOpen && (
            <div className={styles.searchPopup}>
              <div className={styles.searchPopupContent}>
                <button className={styles.closeButton} onClick={() => setIsSearchOpen(false)}>
                  &times;
                </button>
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
          <div className={styles.desktopSearchContainer}>
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
            <div className={styles.searchContainer}>
              <h2>Tìm kiếm bất động sản</h2>
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
        </section>
        <section className={styles.apartmentSection}>
          <h2>Căn hộ chung cư theo khu vực</h2>
            {districtsWithPostCount.length > 0 && (
              <div className={styles.apartmentGridHorizontal}>
                <div className={styles.largeApartmentItemHorizontal}>
                  <img
                    src={`https://picsum.photos/600/400?random=${districtsWithPostCount[0].id}`}
                    alt={districtsWithPostCount[0].name}
                  />
                  <div className={styles.apartmentInfo}>
                    <h3>Quận {districtsWithPostCount[0].name}</h3>
                    <p>{districtsWithPostCount[0].post_count} tin đăng</p>
                  </div>
                </div>
                <div className={styles.smallApartmentItemsHorizontal}>
                  {districtsWithPostCount.slice(1, 5).map((district) => (
                    <div className={styles.apartmentItem} key={district.id}>
                      <img
                        src={`https://picsum.photos/300/200?random=${district.id}`}
                        alt={district.name}
                      />
                      <div className={styles.apartmentInfo}>
                        <h3>Quận {district.name}</h3>
                        <p>{district.post_count} tin đăng</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </section>
        <section className={styles.featuredProjectsSection}>
          <h2>Dự án nổi bật</h2>
          <div className={styles.sliderContainer}>
            <button onClick={prevSlide} className={styles.sliderButton}>&#10094;</button>
            <div className={styles.projectsSlider}>
              <div className={styles.projectsGrid} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredProjectsData.map((project) => (
                  <div className={styles.projectCard} key={project.id}>
                    <img src={`https://picsum.photos/300/200?random=${project.id}`} alt={project.name} />
                    <div className={styles.projectInfo}>
                      <h3>{project.name}</h3>
                      <p>{project.districts.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={nextSlide} className={styles.sliderButton}>&#10095;</button>
          </div>
        </section>
        <section className={styles.latestPropertiesSection}>
          <div className={styles.sectionHeader}>
            <h2>Bất động sản bán mới nhất</h2>
            <Link href="/bat-dong-san-ban" className={styles.seeMoreButton}>Xem thêm</Link>
          </div>
          <div className={styles.propertiesGrid}>
            {latestSalePosts.map((post) => (
              <Link href={`/tin-dang/${post.slug}`} key={post.id} className={styles.propertyLink}>
                <div className={styles.propertyCard}>
                  <img src={post.avatar_image} alt={post.title} />
                  <div className={styles.propertyInfo}>
                    <h3>{post.title}</h3>
                    <p className={styles.price}>{(post.price / 1000000000).toFixed(2)} tỷ</p>
                    <p className={styles.details}>{post.area}m² - {post.bedrooms} PN</p>
                    <p className={styles.location}>{post.project_name}, {post.districts.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.latestPropertiesSection}>
          <div className={styles.sectionHeader}>
            <h2>Bất động sản thuê mới nhất</h2>
            <Link href="/bat-dong-san-thue" className={styles.seeMoreButton}>Xem thêm</Link>
          </div>
          <div className={styles.propertiesGrid}>
            {latestRentPosts.map((post) => (
                <Link href={`/tin-dang/${post.slug}`} key={post.id} className={styles.propertyLink}>
                  <div className={styles.propertyCard}>
                    <img src={post.avatar_image} alt={post.title} />
                    <div className={styles.propertyInfo}>
                      <h3>{post.title}</h3>
                      <p className={styles.price}>{(post.price / 1000000).toFixed(0)} triệu/tháng</p>
                      <p className={styles.details}>{post.area}m² - {post.bedrooms} PN</p>
                      <p className={styles.location}>{post.project_name}, {post.districts.name}</p>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
