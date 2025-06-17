-- Tạo bảng cities để quản lý thông tin thành phố
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng districts để quản lý thông tin quận
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    city_id INT REFERENCES cities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng users để quản lý tài khoản người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    name VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng transactions để quản lý lịch sử giao dịch
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    transaction_type VARCHAR(50),
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng advertisements để quản lý gói quảng cáo
CREATE TABLE advertisements (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    ad_type VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng admin_settings để quản lý hệ thống
CREATE TABLE admin_settings (
    id SERIAL PRIMARY KEY,
    setting_name VARCHAR(255) NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng projects để chứa thông tin các dự án
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    district_id INT REFERENCES districts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng posts để chứa thông tin chi tiết về các tin đăng
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    post_type VARCHAR(50) NOT NULL, -- Loại tin: thường / VIP / nổi bật
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    property_type VARCHAR(50), -- Loại bất động sản
    purpose VARCHAR(50), -- Mục đích (Bán / Cho thuê)
    price NUMERIC, -- Giá
    area NUMERIC, -- Diện tích
    bedrooms INT, -- Số phòng ngủ
    bathrooms INT, -- Số phòng vệ sinh
    floors INT, -- Số tầng
    direction VARCHAR(50), -- Hướng nhà / ban công
    furniture_status VARCHAR(50), -- Tình trạng nội thất
    legal_status VARCHAR(50), -- Tình trạng pháp lý
    post_code VARCHAR(50), -- Mã tin đăng
    project_name VARCHAR(255), -- Tên dự án
    address VARCHAR(255), -- Địa chỉ chi tiết
    ward VARCHAR(255), -- Phường / xã
    district_id INT REFERENCES districts(id), -- Quận / huyện
    city_id INT REFERENCES cities(id), -- Tỉnh / thành phố
    contact_name VARCHAR(255), -- Họ tên người đăng
    contact_phone VARCHAR(20), -- Số điện thoại
    contact_zalo VARCHAR(255), -- Zalo
    account_type VARCHAR(50), -- Loại tài khoản
    images TEXT[], -- Danh sách ảnh
    avatar_image VARCHAR(255), -- Ảnh đại diện
    videos TEXT[], -- Video
    apartment_code VARCHAR(50), -- Mã căn / số căn
    handover_time TIMESTAMP, -- Thời gian nhận nhà
    price_per_sqm NUMERIC, -- Đơn giá/m²
    management_fee NUMERIC, -- Phí quản lý
    utilities TEXT[], -- Thông tin tiện ích xung quanh
    social_links TEXT[] -- Liên kết mạng xã hội chia sẻ
);

-- Loại bỏ bảng listings
DROP TABLE IF EXISTS listings;

-- Thêm dữ liệu mẫu cho các quận ở Hà Nội
INSERT INTO cities (name, slug, created_at) VALUES
('Hà Nội', 'ha-noi', CURRENT_TIMESTAMP);

INSERT INTO districts (name, slug, city_id, created_at) VALUES
('Ba Đình', 'ba-dinh', 1, CURRENT_TIMESTAMP),
('Hoàn Kiếm', 'hoan-kiem', 1, CURRENT_TIMESTAMP),
('Đống Đa', 'dong-da', 1, CURRENT_TIMESTAMP),
('Hai Bà Trưng', 'hai-ba-trung', 1, CURRENT_TIMESTAMP),
('Cầu Giấy', 'cau-giay', 1, CURRENT_TIMESTAMP),
('Thanh Xuân', 'thanh-xuan', 1, CURRENT_TIMESTAMP),
('Hà Đông', 'ha-dong', 1, CURRENT_TIMESTAMP),
('Long Biên', 'long-bien', 1, CURRENT_TIMESTAMP),
('Nam Từ Liêm', 'nam-tu-liem', 1, CURRENT_TIMESTAMP),
('Bắc Từ Liêm', 'bac-tu-liem', 1, CURRENT_TIMESTAMP);

-- Thêm dữ liệu mẫu cho bảng projects
INSERT INTO projects (name, slug, description, district_id, created_at) VALUES
('Dự án Vinhomes Metropolis', 'vinhomes-metropolis', 'Dự án cao cấp tại Ba Đình', 1, CURRENT_TIMESTAMP),
('Dự án Sun Grand City', 'sun-grand-city', 'Dự án sang trọng tại Hoàn Kiếm', 2, CURRENT_TIMESTAMP),
('Dự án Mipec Tower', 'mipec-tower', 'Dự án hiện đại tại Đống Đa', 3, CURRENT_TIMESTAMP),
('Dự án Times City', 'times-city', 'Dự án tiện ích tại Hai Bà Trưng', 4, CURRENT_TIMESTAMP),
('Dự án Keangnam Landmark', 'keangnam-landmark', 'Dự án nổi bật tại Cầu Giấy', 5, CURRENT_TIMESTAMP),
('Dự án Royal City', 'royal-city', 'Dự án đẳng cấp tại Thanh Xuân', 6, CURRENT_TIMESTAMP),
('Dự án Park City', 'park-city', 'Dự án xanh tại Hà Đông', 7, CURRENT_TIMESTAMP),
('Dự án Ecohome', 'ecohome', 'Dự án thân thiện tại Long Biên', 8, CURRENT_TIMESTAMP),
('Dự án Vinhomes Gardenia', 'vinhomes-gardenia', 'Dự án cao cấp tại Nam Từ Liêm', 9, CURRENT_TIMESTAMP),
('Dự án Goldmark City', 'goldmark-city', 'Dự án hiện đại tại Bắc Từ Liêm', 10, CURRENT_TIMESTAMP);