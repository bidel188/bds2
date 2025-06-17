-- Chú ý: Tập lệnh này giả định rằng có một người dùng (user) với id = 1 đã tồn tại trong bảng 'users'.
-- Nếu chưa có, bạn cần tạo một người dùng trước khi chạy tập lệnh này.
-- INSERT INTO users (id, email, name) VALUES (1, 'test@example.com', 'Test User');

DO $$
DECLARE
    proj RECORD;
    i INTEGER;
    purpose_type VARCHAR;
    post_title VARCHAR;
    post_slug VARCHAR;
    random_price NUMERIC;
    random_area NUMERIC;
BEGIN
    -- Lặp qua từng dự án trong bảng projects
    FOR proj IN SELECT id, name, slug, district_id FROM projects LOOP
    
        -- Tạo 3 tin "Bán" cho mỗi dự án
        FOR i IN 1..3 LOOP
            purpose_type := 'Bán';
            -- Tạo diện tích ngẫu nhiên từ 50m² đến 120m²
            random_area := floor(random() * (120 - 50 + 1) + 50);
            -- Tạo giá bán ngẫu nhiên từ 2 đến 10 tỷ VNĐ
            random_price := floor(random() * (100 - 20 + 1) + 20) * 100000000;
            post_title := purpose_type || ' căn hộ dự án ' || proj.name || ' #' || LPAD((proj.id * 5 + i)::text, 4, '0');
            post_slug := proj.slug || '-ban-' || i;

            INSERT INTO posts (
                user_id, title, slug, content, post_type, status, property_type, purpose,
                price, area, bedrooms, bathrooms, floors, direction, furniture_status, legal_status,
                project_name, district_id, city_id, contact_name, contact_phone, images, avatar_image,
                price_per_sqm
            ) VALUES (
                1, -- Giả định user_id = 1
                post_title,
                post_slug,
                'Đây là nội dung mô tả chi tiết cho tin đăng ' || post_title || '. Căn hộ có vị trí đẹp, thoáng mát, gần các tiện ích công cộng. Vui lòng liên hệ để được tư vấn và xem nhà trực tiếp.',
                'thường',
                'published',
                'Căn hộ',
                purpose_type,
                random_price,
                random_area,
                floor(random() * 3 + 1), -- 1-3 phòng ngủ
                floor(random() * 2 + 1), -- 1-2 phòng vệ sinh
                floor(random() * 20 + 5), -- Tầng 5 đến 25
                (ARRAY['Đông', 'Tây', 'Nam', 'Bắc', 'Đông-Bắc', 'Tây-Nam'])[floor(random() * 6 + 1)],
                (ARRAY['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất'])[floor(random() * 3 + 1)],
                'Sổ hồng',
                proj.name,
                proj.district_id,
                1, -- Giả định city_id = 1 (Hà Nội)
                'Nguyễn Văn An',
                '0987654321',
                ARRAY['https://picsum.photos/seed/' || post_slug || '1/800/600', 'https://picsum.photos/seed/' || post_slug || '2/800/600'],
                'https://picsum.photos/seed/' || post_slug || '/400/300',
                random_price / random_area
            );
        END LOOP;

        -- Tạo 2 tin "Cho thuê" cho mỗi dự án
        FOR i IN 1..2 LOOP
            purpose_type := 'Cho thuê';
            -- Tạo diện tích ngẫu nhiên từ 40m² đến 100m²
            random_area := floor(random() * (100 - 40 + 1) + 40);
            -- Tạo giá cho thuê ngẫu nhiên từ 8 đến 25 triệu VNĐ
            random_price := floor(random() * (25 - 8 + 1) + 8) * 1000000;
            post_title := purpose_type || ' căn hộ dự án ' || proj.name || ' #' || LPAD((proj.id * 5 + 3 + i)::text, 4, '0');
            post_slug := proj.slug || '-cho-thue-' || i;

            INSERT INTO posts (
                user_id, title, slug, content, post_type, status, property_type, purpose,
                price, area, bedrooms, bathrooms, floors, direction, furniture_status, legal_status,
                project_name, district_id, city_id, contact_name, contact_phone, images, avatar_image,
                management_fee
            ) VALUES (
                1, -- Giả định user_id = 1
                post_title,
                post_slug,
                'Đây là nội dung mô tả chi tiết cho tin đăng ' || post_title || '. Căn hộ có vị trí đẹp, thoáng mát, gần các tiện ích công cộng. Vui lòng liên hệ để được tư vấn và xem nhà trực tiếp.',
                'thường',
                'published',
                'Căn hộ',
                purpose_type,
                random_price,
                random_area,
                floor(random() * 3 + 1), -- 1-3 phòng ngủ
                floor(random() * 2 + 1), -- 1-2 phòng vệ sinh
                floor(random() * 20 + 5), -- Tầng 5 đến 25
                (ARRAY['Đông', 'Tây', 'Nam', 'Bắc', 'Đông-Bắc', 'Tây-Nam'])[floor(random() * 6 + 1)],
                (ARRAY['Nội thất đầy đủ', 'Nội thất cơ bản', 'Không nội thất'])[floor(random() * 3 + 1)],
                'Hợp đồng dài hạn',
                proj.name,
                proj.district_id,
                1, -- Giả định city_id = 1 (Hà Nội)
                'Trần Thị Bình',
                '0123456789',
                ARRAY['https://picsum.photos/seed/' || post_slug || '1/800/600', 'https://picsum.photos/seed/' || post_slug || '2/800/600'],
                'https://picsum.photos/seed/' || post_slug || '/400/300',
                floor(random() * (2000000 - 500000 + 1) + 500000) -- Phí quản lý từ 500k đến 2 triệu
            );
        END LOOP;
    END LOOP;
END $$;