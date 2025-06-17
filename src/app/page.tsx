"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

type District = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

export default function Home() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeTab, setActiveTab] = useState("bán");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const featuredProjects = [
    { name: "Vinhomes Ocean Park", location: "Gia Lâm, Hà Nội", image: "https://picsum.photos/300/200?random=6" },
    { name: "The Zei", location: "Nam Từ Liêm, Hà Nội", image: "https://picsum.photos/300/200?random=7" },
    { name: "Masteri Waterfront", location: "Gia Lâm, Hà Nội", image: "https://picsum.photos/300/200?random=8" },
    { name: "BRG Smart City", location: "Đông Anh, Hà Nội", image: "https://picsum.photos/300/200?random=9" },
    { name: "Vinhomes Smart City", location: "Nam Từ Liêm, Hà Nội", image: "https://picsum.photos/300/200?random=10" },
    { name: "Ecopark", location: "Văn Giang, Hưng Yên", image: "https://picsum.photos/300/200?random=11" },
    { name: "Sunshine City", location: "Bắc Từ Liêm, Hà Nội", image: "https://picsum.photos/300/200?random=12" },
    { name: "Keangnam Landmark 72", location: "Nam Từ Liêm, Hà Nội", image: "https://picsum.photos/300/200?random=13" },
    { name: "Royal City", location: "Thanh Xuân, Hà Nội", image: "https://picsum.photos/300/200?random=14" },
    { name: "Times City", location: "Hai Bà Trưng, Hà Nội", image: "https://picsum.photos/300/200?random=15" },
    { name: "The Manor", location: "Nam Từ Liêm, Hà Nội", image: "https://picsum.photos/300/200?random=16" },
    { name: "Ciputra", location: "Tây Hồ, Hà Nội", image: "https://picsum.photos/300/200?random=17" },
  ];

  const projectsPerSlide = 4;
  const totalSlides = Math.ceil(featuredProjects.length / projectsPerSlide);

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

  return (
    <div>
      <header className={styles.header}>
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
      </header>
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

                  <button className={styles.searchButton}>Tìm kiếm</button>
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

                <button className={styles.searchButton}>Tìm kiếm</button>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.apartmentSection}>
          <h2>Căn hộ chung cư theo khu vực</h2>
          <div className={styles.apartmentGridHorizontal}>
            <div className={styles.largeApartmentItemHorizontal}>
              <img
                src="https://picsum.photos/600/400?random=1"
                alt="Quận Cầu Giấy"
              />
              <div className={styles.apartmentInfo}>
                <h3>Quận Cầu Giấy</h3>
                <p>895 tin đăng</p>
              </div>
            </div>
            <div className={styles.smallApartmentItemsHorizontal}>
              <div className={styles.apartmentItem}>
                <img
                  src="https://picsum.photos/300/200?random=2"
                  alt="Quận Nam Từ Liêm"
                />
                <div className={styles.apartmentInfo}>
                  <h3>Quận Nam Từ Liêm</h3>
                  <p>705 tin đăng</p>
                </div>
              </div>
              <div className={styles.apartmentItem}>
                <img
                  src="https://picsum.photos/300/200?random=3"
                  alt="CC Quận Bắc Từ Liêm"
                />
                <div className={styles.apartmentInfo}>
                  <h3>CC Quận Bắc Từ Liêm</h3>
                  <p>517 tin đăng</p>
                </div>
              </div>
              <div className={styles.apartmentItem}>
                <img
                  src="https://picsum.photos/300/200?random=4"
                  alt="Quận Tây Hồ"
                />
                <div className={styles.apartmentInfo}>
                  <h3>Quận Tây Hồ</h3>
                  <p>72 tin đăng</p>
                </div>
              </div>
              <div className={styles.apartmentItem}>
                <img
                  src="https://picsum.photos/300/200?random=5"
                  alt="Quận Thanh Xuân"
                />
                <div className={styles.apartmentInfo}>
                  <h3>Quận Thanh Xuân</h3>
                  <p>69 tin đăng</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.featuredProjectsSection}>
          <h2>Dự án nổi bật</h2>
          <div className={styles.sliderContainer}>
            <button onClick={prevSlide} className={styles.sliderButton}>&#10094;</button>
            <div className={styles.projectsSlider}>
              <div className={styles.projectsGrid} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredProjects.map((project, index) => (
                  <div className={styles.projectCard} key={index}>
                    <img src={project.image} alt={project.name} />
                    <div className={styles.projectInfo}>
                      <h3>{project.name}</h3>
                      <p>{project.location}</p>
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
            {[...Array(8)].map((_, i) => (
              <div className={styles.propertyCard} key={i}>
                <img src={`https://picsum.photos/300/200?random=${18 + i}`} alt={`Property ${i + 1}`} />
                <div className={styles.propertyInfo}>
                  <h3>Bán căn hộ chung cư {i + 1}</h3>
                  <p className={styles.price}>{Math.floor(Math.random() * 5) + 1} tỷ</p>
                  <p className={styles.details}>70m² - 2 PN</p>
                  <p className={styles.location}>Quận {i + 1}, Hà Nội</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.latestPropertiesSection}>
          <div className={styles.sectionHeader}>
            <h2>Bất động sản thuê mới nhất</h2>
            <Link href="/bat-dong-san-thue" className={styles.seeMoreButton}>Xem thêm</Link>
          </div>
          <div className={styles.propertiesGrid}>
            {[...Array(8)].map((_, i) => (
              <div className={styles.propertyCard} key={i}>
                <img src={`https://picsum.photos/300/200?random=${28 + i}`} alt={`Property ${i + 1}`} />
                <div className={styles.propertyInfo}>
                  <h3>Cho thuê căn hộ {i + 1}</h3>
                  <p className={styles.price}>{Math.floor(Math.random() * 10) + 5} triệu/tháng</p>
                  <p className={styles.details}>50m² - 1 PN</p>
                  <p className={styles.location}>Quận {i + 1}, Hà Nội</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
