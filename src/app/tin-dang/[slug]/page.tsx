"use client";

import { useParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';

export default function PropertyDetail() {
  const params = useParams();
  const { slug } = params; // Now using slug
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // In a real app, you would fetch property data based on the id
  const property = {
    title: 'BÁN CĂN HỘ CAO CẤP INDOCHINA PLAZA – 131M², 3PN, FULL NỘI THẤT, TẦNG CAO VIEW ĐẸP',
    price: 'Thỏa thuận',
    address: 'Dự án Indochina Plaza, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội.',
    area: '131 m²',
    bedrooms: '3 PN',
    bathrooms: '2 WC',
    furniture: 'Full nội thất',
    description: `
      <p>🔹 Diện tích: 131m²</p>
      <p>🔹 Thiết kế: 3 phòng ngủ, 2 vệ sinh, không gian rộng rãi, thoáng mát</p>
      <p>🔹 Nội thất: Full cao cấp, thiết kế sang trọng, chỉ cần xách vali vào ở</p>
      <p>🔹 View đẹp, đón nắng và gió tự nhiên</p>
      <br/>
      <p><strong>✨ Tiện ích tại Indochina Plaza:</strong></p>
      <p>✔️ Trung tâm thương mại ngay dưới tòa nhà, đầy đủ nhà hàng, quán café, siêu thị</p>
      <p>✔️ Bể bơi, gym, khu vui chơi trẻ em, spa, an ninh 24/7</p>
      <p>✔️ Giao thông thuận tiện, ngay cạnh tuyến Metro Nhổn – Ga Hà Nội</p>
      <br/>
      <p><strong>📌 Giá bán tốt nhất – Thương lượng trực tiếp</strong></p>
      <p><strong>📞 Liên hệ ngay: 0971923638 (Call/Zalo) để xem nhà</strong></p>
    `,
    agent: {
      name: 'Thành Đạt',
      phone: '0971923638',
      avatar: 'https://picsum.photos/100/100?random=50'
    },
    images: [
      'https://picsum.photos/800/600?random=51',
      'https://picsum.photos/800/600?random=52',
      'https://picsum.photos/800/600?random=53',
      'https://picsum.photos/800/600?random=54',
      'https://picsum.photos/800/600?random=55',
    ],
    details: {
      type: 'Căn hộ chung cư',
      address: '241 Xuân Thủy.',
      status: 'Đang trống',
      project: 'Indochina Plaza',
      area: '131m²',
      bedrooms: '3 PN',
      bathrooms: '2 WC',
      furniture: 'Full nội thất',
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.container}>
      {/* Header can be a shared component */}
      <header className={styles.header}>
        <div className={styles.logo}>bds29.vn</div>
        <nav className={styles.navbar}>
          <Link href="/">Trang chủ</Link>
          <Link href="/can-ho-ban">Căn hộ bán</Link>
          <Link href="/can-ho-cho-thue">Căn hộ cho thuê</Link>
          <Link href="/du-an">Dự án</Link>
          <Link href="/tin-tuc">Tin tức</Link>
        </nav>
        <div className={styles.actions}>
          <button className={styles.loginButton}>Đăng nhập</button>
          <button className={styles.postButton}>Đăng tin</button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.propertyDetails}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageContainer}>
              <img src={property.images[currentImageIndex]} alt="Main property image" className={styles.mainImage} />
              <button onClick={prevImage} className={`${styles.slideButton} ${styles.prevButton}`}>&#10094;</button>
              <button onClick={nextImage} className={`${styles.slideButton} ${styles.nextButton}`}>&#10095;</button>
            </div>
            <div className={styles.thumbnailContainer}>
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                  onClick={() => selectImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Main Info */}
          <div className={styles.infoSection}>
            <h1>{property.title}</h1>
            <p className={styles.address}>{property.address}</p>
            <div className={styles.priceInfo}>
              <span className={styles.price}>{property.price}</span>
              <span className={styles.area}>{property.area}</span>
            </div>
            <div className={styles.propertyMeta}>
              <span><strong>Phòng ngủ:</strong> {property.bedrooms}</span>
              <span><strong>Phòng tắm:</strong> {property.bathrooms}</span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h2>Thông tin mô tả</h2>
            <div dangerouslySetInnerHTML={{ __html: property.description }} />
          </div>

          {/* Property Characteristics */}
          <div className={styles.characteristics}>
            <h2>Đặc điểm bất động sản</h2>
            <table className={styles.charTable}>
              <tbody>
                <tr>
                  <td><strong>Loại hình:</strong></td>
                  <td>{property.details.type}</td>
                </tr>
                <tr>
                  <td><strong>Địa chỉ:</strong></td>
                  <td>{property.details.address}</td>
                </tr>
                <tr>
                  <td><strong>Tình trạng BĐS:</strong></td>
                  <td>{property.details.status}</td>
                </tr>
                <tr>
                  <td><strong>Dự án:</strong></td>
                  <td>{property.details.project}</td>
                </tr>
                <tr>
                  <td><strong>Diện tích:</strong></td>
                  <td>{property.details.area}</td>
                </tr>
                <tr>
                  <td><strong>Số phòng ngủ:</strong></td>
                  <td>{property.details.bedrooms}</td>
                </tr>
                <tr>
                  <td><strong>Số toilet:</strong></td>
                  <td>{property.details.bathrooms}</td>
                </tr>
                <tr>
                  <td><strong>Nội thất:</strong></td>
                  <td>{property.details.furniture}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.agentCard}>
            <img src={property.agent.avatar} alt={property.agent.name} className={styles.agentAvatar} />
            <h3>{property.agent.name}</h3>
            <button className={styles.contactButton}>{property.agent.phone}</button>
            <button className={styles.zaloButton}>Liên hệ Zalo: {property.agent.name}</button>
          </div>
        </aside>
      </main>
    </div>
  );
}