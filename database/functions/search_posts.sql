 
CREATE OR REPLACE FUNCTION search_posts(
  search_purpose TEXT DEFAULT NULL,
  search_district_id INTEGER DEFAULT NULL,
  search_project_id INTEGER DEFAULT NULL,
  search_area TEXT DEFAULT NULL,
  search_bedrooms TEXT DEFAULT NULL,
  search_furniture TEXT DEFAULT NULL
)
RETURNS TABLE (
  id INTEGER,
  slug VARCHAR,
  avatar_image VARCHAR,
  title VARCHAR,
  purpose VARCHAR,
  price NUMERIC,
  area NUMERIC,
  bedrooms INTEGER,
  project_name VARCHAR,
  district_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    posts.id,
    posts.slug,
    posts.avatar_image,
    posts.title,
    posts.purpose,
    posts.price,
    posts.area,
    posts.bedrooms,
    posts.project_name,
    districts.name AS district_name
  FROM posts
  LEFT JOIN districts ON posts.district_id = districts.id
  WHERE
    (search_purpose IS NULL OR posts.purpose = search_purpose) AND
    (search_district_id IS NULL OR posts.district_id = search_district_id) AND
    (search_project_id IS NULL) AND
    (search_area IS NULL OR
      (search_area = '<50' AND posts.area < 50) OR
      (search_area = '50-100' AND posts.area BETWEEN 50 AND 100) OR
      (search_area = '100-150' AND posts.area BETWEEN 100 AND 150) OR
      (search_area = '>150' AND posts.area > 150)) AND
    (search_bedrooms IS NULL OR
      (search_bedrooms = '1' AND posts.bedrooms = 1) OR
      (search_bedrooms = '2' AND posts.bedrooms = 2) OR
      (search_bedrooms = '3' AND posts.bedrooms = 3) OR
      (search_bedrooms = '4+' AND posts.bedrooms >= 4)) AND
    (search_furniture IS NULL OR posts.furniture_status = search_furniture);
END;
$$ LANGUAGE plpgsql;