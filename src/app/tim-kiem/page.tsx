"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import styles from './SearchPage.module.css';
import Header from '@/components/Header';

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
  districts: { name: string };
};

function SearchContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const propertyType = searchParams.get('loai');
  const district = searchParams.get('quan');
  const project = searchParams.get('duan');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      let query = supabase.from('posts').select('*, districts(name)');

      if (propertyType) {
        query = query.eq('purpose', propertyType === 'ban' ? 'Bán' : 'Cho thuê');
      }
      if (district) {
        query = query.eq('districts.name', district.replace(/-/g, ' '));
      }
      if (project) {
        query = query.eq('project_name', project.replace(/-/g, ' '));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
        setResults(data as Post[]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [propertyType, district, project]);

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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header showSearch={true} />
      <SearchContent />
    </Suspense>
  );
}