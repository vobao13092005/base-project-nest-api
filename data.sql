SET session_replication_role = 'replica';

DROP TABLE PUBLIC."mikro_orm_migrations";

INSERT INTO PUBLIC."addresses" ("addressId", "detailAddress", "addressName", "addressPhone", "department", "addressNote", "userId") VALUES (1, 'Cảng Liyue, Teyvat', 'Nhà của tôi', '09876543221', 'Tầng 1', 'Hihi', 1), (2, 'Ngu Hanh Son', 'Vo Ngoc Bao', '0987654321', '1', 'Khong co', 2);

INSERT INTO PUBLIC."categories" ("categoryId", "categoryName", "categoryDescription") VALUES (1, 'Món chính', 'Các món ăn chính trong bữa ăn như cơm, phở, bún, mì.'), (2, 'Món khai vị', 'Những món ăn nhẹ dùng trước bữa chính như gỏi cuốn, súp.'), (3, 'Món tráng miệng', 'Các món ngọt dùng sau bữa ăn như chè, kem, bánh ngọt.'), (4, 'Đồ uống', 'Các loại nước giải khát như nước ép, trà, sinh tố.'), (5, 'Đồ ăn nhanh', 'Các món ăn tiện lợi như bánh mì, hamburger, khoai tây chiên.'), (6, 'Đồ ăn vặt', 'Là những món ăn nhỏ, thường được dùng giữa các bữa chính để ăn chơi, nhâm nhi hoặc tụ tập cùng bạn bè.');

INSERT INTO PUBLIC."order_items" ("orderItemId", "totalPrice", "quantity", "note", "deliveryStatus", "productId", "orderId", "createdAt", "updatedAt") VALUES (1, 55000, 1, '', 'delivered', 3, 1, '2025-05-18 12:22:56', '2025-05-18 12:24:00'), (2, 50000, 1, '', 'delivered', 3, 2, '2025-05-18 12:30:48', '2025-05-18 12:32:44');

INSERT INTO PUBLIC."orders" ("orderId", "vnpayOrderId", "orderTotalPrice", "isDraft", "purchaseMethod", "userId", "addressId", "createdAt", "updatedAt") VALUES (1, '18192257', 55000, false, 'bank', 1, 1, '2025-05-18 12:22:56', '2025-05-18 12:22:56'), (2, '18193049', 50000, false, 'bank', 2, 2, '2025-05-18 12:30:48', '2025-05-18 12:30:48');

INSERT INTO PUBLIC."orders_toppings" ("orderToppingId", "orderItemId", "toppingValueId") VALUES (1, 1, 7), (2, 1, 5), (3, 2, 4), (4, 2, 6);

INSERT INTO PUBLIC."product_images" ("productImageId", "imageUrl", "productId") VALUES (1, 'https://hunufa.vn/wp-content/uploads/2024/10/hinh-ly-tra-sua-dep-46.webp', 1), (2, 'https://files.catbox.moe/xqpfga.png', 2), (3, 'https://files.catbox.moe/m6f8lv.png', 3), (4, 'https://files.catbox.moe/hmnqb1.png', 4), (5, 'https://files.catbox.moe/i70cpa.png', 5), (6, 'https://files.catbox.moe/fajs05.png', 6), (7, 'https://files.catbox.moe/0injmw.png', 7), (8, 'https://files.catbox.moe/lg3u09.png', 8);

INSERT INTO PUBLIC."products" ("productId", "productName", "productPrice", "productDescription", "productStatus", "storeId", "createdAt", "updatedAt") VALUES (1, 'Trà sữa', 30000, 'Là thức uống kết hợp giữa trà và sữa, thường được uống lạnh. Trà sữa có vị béo nhẹ, ngọt vừa phải và thường kèm theo trân châu hoặc các loại thạch khác.', 'available', 1, '2025-05-18 00:05:59', '2025-05-18 00:21:33'), (2, 'Mì cay', 35000, 'Mì nấu với nước dùng cay, thường có kim chi, xúc xích, hải sản hoặc bò viên. Mì cay có nhiều cấp độ tùy theo khẩu vị người ăn, thường được dùng nóng.', 'available', 1, '2025-05-18 00:05:59', '2025-05-18 00:21:54'), (3, 'Chân gà', 35000, 'Chân gà được làm sạch, rút bỏ xương, sau đó chế biến với nước sốt chua cay hoặc ngâm giấm. Món này có vị đậm đà, dai giòn và dễ ăn.', 'available', 1, '2025-05-18 00:05:59', '2025-05-18 00:21:43'), (4, 'Xôi', 15000, 'Xôi là một món ăn thông dụng được làm từ nguyên liệu chính là gạo nếp, đồ/hấp chín bằng hơi nước, thịnh hành trong ẩm thực của nhiều nước châu Á.', 'available', 1, '2025-05-18 00:15:19', '2025-05-18 00:15:19'), (5, 'Bánh tráng trộn', 15000, 'Một món ăn vặt đường phố được giới trẻ cực kỳ yêu thích. Có nhiều cách làm biến tấu khác nhau (Ví dụ: bánh tráng trộn bò khô, bánh tráng bơ, bánh tráng sa tế, bánh tráng trộn Tây Ninh… ), tuy nhiên bánh tráng trộn vẫn có nét rất riêng mà không phải món ăn nào cũng có được.', 'available', 1, '2025-05-18 00:36:52', '2025-05-18 00:36:52'), (6, 'Bánh mì nướng muối ớt', 15000, 'Bánh mì được quét một lớp pate béo ngậy bên trong, phết thêm một lớp ớt sa tế cay cay đặc chế của quán lên bên ngoài bánh mì rồi nướng trên lửa than thơm phức', 'available', 1, '2025-05-18 00:38:08', '2025-05-18 00:38:08'), (7, 'Gỏi cuốn', 35000, 'Một lớp bάnh trάng mὀng vừa, hơi ươn ướt, thêm vài con tôm luộc đὀ au và miếng thịt đὺi luộc mὀng cὺng lớp mỡ trong vắt, nền là xà lách và rau thơm xanh mượt cuộn quanh ίt sợi bύn trắng nõn', 'available', 1, '2025-05-18 00:42:13', '2025-05-18 00:42:13'), (8, 'Cá viên chiên', 50000, 'Những viên chả cá, chả bò… được chiên lên rồi ăn cùng với tương ớt', 'available', 1, '2025-05-18 00:43:30', '2025-05-18 00:43:30');

INSERT INTO PUBLIC."products_categories" ("orderToppingId", "productId", "categoryId1") VALUES (1, 4, 1), (2, 1, 3), (3, 1, 4), (4, 2, 1), (5, 2, 5), (6, 3, 5), (7, 3, 1), (8, 8, 6), (9, 8, 5), (10, 7, 5), (11, 7, 6), (12, 6, 6), (13, 6, 5), (15, 5, 6), (16, 5, 3);

INSERT INTO PUBLIC."products_toppings" ("productToppingId", "productId", "toppingId") VALUES (1, 1, 1), (2, 1, 2), (3, 2, 3), (4, 3, 4), (5, 3, 5);

INSERT INTO PUBLIC."reviews" ("reviewId", "reviewScore", "reviewContent", "userId", "productId", "createdAt", "updatedAt") VALUES (1, 3, 'Ngon', 1, 3, '2025-05-18 12:25:11', '2025-05-18 12:25:11'), (3, 4, 'an nhu loz', 2, 3, '2025-05-18 12:34:59', '2025-05-18 12:34:59');

INSERT INTO PUBLIC."roles" ("roleId", "roleLabel", "rolePriority", "createdAt", "updatedAt") VALUES (1, 'User', 1, '2025-05-18 00:05:59', '2025-05-18 00:05:59');

INSERT INTO PUBLIC."store_images" ("storeImageId", "imageUrl", "storeId") VALUES (1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKl1R5PC0jj1Fzcm-kQEe1yz30b_slRKs4jQ&s', 1);

INSERT INTO PUBLIC."stores" ("storeId", "storeName", "storeAddress", "storePhoneNumber", "storeStatus", "openingHours", "closingHours", "userId", "createdAt", "updatedAt") VALUES (1, 'Tiệm ăn vặt', 'Ngũ Hành Sơn, Đà Nẵng', '0987654321', 'active', '7:00', '04:00', 1, '2025-05-18 00:05:59', '2025-05-18 12:22:48');

INSERT INTO PUBLIC."topping_values" ("toppingValueId", "toppingValueName", "toppingPrice", "toppingId") VALUES (1, 'Mì cay bò', 10000, 3), (2, 'Mì cay hải sản', 20000, 3), (3, 'Mì cay xúc xích cá viên', 5000, 3), (4, 'Sốt thái', 10000, 4), (5, 'Sốt sả tắc', 5000, 4), (6, 'Xoài', 5000, 5), (7, 'Trứng non', 15000, 5), (8, 'Thạch dừa', 5000, 1), (9, 'Thạch phô mai', 8000, 1), (10, 'Thạch chocolate', 4000, 1), (11, 'Size vừa', 5000, 2), (12, 'Size lớn', 10000, 2);

INSERT INTO PUBLIC."toppings" ("toppingId", "toppingName", "multiple", "shopId") VALUES (1, 'Thạch', true, 1), (2, 'Size', false, 1), (3, 'Vị', false, 1), (4, 'Loại sốt', false, 1), (5, 'Đồ ăn phụ', true, 1);

INSERT INTO PUBLIC."users" ("userId", "username", "password", "email", "fullname", "avatar", "phoneNumber", "createdAt", "updatedAt") VALUES (1, 'test', '$2b$10$k96v3IdLTEi7BH2ecwU1neHuxN507dFR3OVDJJqXYY0hFPziXz1/u', 'baovn.23itb@vku.udn.vn', 'Vo Ngoc Bao 23IT.B010', NULL, '0335237597', '2025-05-18 00:05:59', '2025-05-18 00:07:33'), (2, 'florentino', '$2b$10$j.CNGd/tAG0M0o7np67A2eAH2Gn6p6cswTBfR4kwpBGf4.LciEXeK', 'florentino@vku.udn.vn', 'florentino', NULL, '0987654321', '2025-05-18 12:30:14', '2025-05-18 12:30:14');

INSERT INTO PUBLIC."users_roles" ("userRoleId", "userId", "roleId", "createdAt", "updatedAt") VALUES (1, 1, 1, '2025-05-18 00:05:59', '2025-05-18 00:05:59'), (2, 2, 1, '2025-05-18 12:30:14', '2025-05-18 12:30:14');

-- Create a temporary function to reset sequences
CREATE OR REPLACE FUNCTION reset_all_sequences() RETURNS void AS '
DECLARE
    rec RECORD;
    max_id BIGINT;
BEGIN
    FOR rec IN (
        SELECT
            t.table_name,
            c.column_name,
            pg_get_serial_sequence(t.table_name, c.column_name) AS seq_name
        FROM information_schema.tables t
        JOIN information_schema.columns c ON t.table_name = c.table_name
        WHERE t.table_schema = ''public''
        AND c.table_name IN (
            ''addresses'', ''categories'', ''order_items'', ''orders'', ''orders_toppings'',
            ''product_images'', ''products'', ''products_categories'', ''products_toppings'',
            ''reviews'', ''roles'', ''sessions'', ''store_images'', ''stores'',
            ''topping_values'', ''toppings'', ''users'', ''users_roles''
        )
        AND pg_get_serial_sequence(t.table_name, c.column_name) IS NOT NULL
    ) LOOP
        EXECUTE ''SELECT COALESCE(MAX('' || quote_ident(rec.column_name) || ''), 0) FROM '' || quote_ident(rec.table_name) INTO max_id;

        IF max_id = 0 THEN
            EXECUTE ''SELECT setval('' || quote_literal(rec.seq_name) || '', 1, false)'';
        ELSE
            EXECUTE ''SELECT setval('' || quote_literal(rec.seq_name) || '', '' || max_id || '')'';
        END IF;

        RAISE NOTICE ''Set sequence % to % for table %'', rec.seq_name, max_id, rec.table_name;
    END LOOP;
END;
' LANGUAGE plpgsql;

-- Execute the function
SELECT reset_all_sequences();

SET session_replication_role = 'origin';