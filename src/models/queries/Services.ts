export const QUERY_getServices = `
SELECT 
    s.id, s.price, s.calification, s.description, s.category_id, c.name AS category,
    JSON_BUILD_OBJECT(
        'id', u.id,
        'identification_type_id', it.id,
        'identification_type', it.name,
        'identification', u.identification,
        'fullname', u.fullname,
        'email', u.email,
        'avatar_url', u.avatar_url,
        'phone', u.phone,
        'birthdate', u.birthdate,
        'role_id', r.id,
        'role', r.name,
        'available_days', u.available_days
    ) as user
FROM dbo."Service" s
INNER JOIN dbo."Category" c ON c.id = s.category_id
INNER JOIN dbo."User" u ON u.id = s.user_id
INNER JOIN dbo."IdentificationType" it ON it.id = u.identification_type_id
INNER JOIN dbo."Role" r ON r.id = u.role_id
`;

export const QUERY_getOneService = `
SELECT 
    s.id, s.price, s.calification, s.description, s.category_id, c.name AS category,
    JSON_BUILD_OBJECT(
        'id', u.id,
        'identification_type_id', it.id,
        'identification_type', it.name,
        'identification', u.identification,
        'fullname', u.fullname,
        'email', u.email,
        'avatar_url', u.avatar_url,
        'phone', u.phone,
        'birthdate', u.birthdate,
        'role_id', r.id,
        'role', r.name,
        'available_days', u.available_days
    ) as user
FROM dbo."Service" s
INNER JOIN dbo."Category" c ON c.id = s.category_id
INNER JOIN dbo."User" u ON u.id = s.user_id
INNER JOIN dbo."IdentificationType" it ON it.id = u.identification_type_id
INNER JOIN dbo."Role" r ON r.id = u.role_id
WHERE s.id = $1
`;

export const QUERY_getServicesBycategory = `
SELECT 
    s.id, s.price, s.calification, s.description, s.category_id, c.name AS category,
    JSON_BUILD_OBJECT(
        'id', u.id,
        'identification_type_id', it.id,
        'identification_type', it.name,
        'identification', u.identification,
        'fullname', u.fullname,
        'email', u.email,
        'avatar_url', u.avatar_url,
        'phone', u.phone,
        'birthdate', u.birthdate,
        'role_id', r.id,
        'role', r.name,
        'available_days', u.available_days
    ) as user
FROM dbo."Service" s
INNER JOIN dbo."Category" c ON c.id = s.category_id
INNER JOIN dbo."User" u ON u.id = s.user_id
INNER JOIN dbo."IdentificationType" it ON it.id = u.identification_type_id
INNER JOIN dbo."Role" r ON r.id = u.role_id
WHERE s.category_id = $1
`;