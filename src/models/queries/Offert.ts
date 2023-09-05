export const QUERY_myOfferts = `
select
    o.id, o.created_date, o.agended_date, o.price, o.user_location, o.user_provider_location,
    JSON_BUILD_OBJECT(
        'price', s.price,
        'calification', s.calification,
        'category', c.name
    ) as service,
    JSON_BUILD_OBJECT(
        'identification_type_id', it.id,
        'identification_type', it.name,
        'identification', u.identification,
        'fullname', u.fullname,
        'email', u.email,
        'avatar_url', u.avatar_url,
        'phone', u.phone,
        'birthdate', u.birthdate,
        'role_id', r.id,
        'role', r.name
    ) as user_provider_service
FROM dbo."Offert" o
INNER JOIN dbo."Service" s ON s.id = o.service_id
INNER JOIN dbo."Category" c ON c.id = s.category_id
INNER JOIN dbo."User" u ON u.id = s.user_id
INNER JOIN dbo."IdentificationType" it ON it.id = u.identification_type_id
INNER JOIN dbo."Role" r ON r.id = u.role_id
WHERE o.user_id = $1 AND ($2::integer IS NULL OR o.status_id = $2::integer)
ORDER BY
    CASE WHEN $3 = 'ASC' THEN o.price END ASC,
    CASE WHEN $3 = 'DESC' THEN o.price END DESC,
    agended_date DESC
LIMIT $4 OFFSET $5;`;


export const QUEEY_offerts = `
select
    o.id, o.created_date, o.agended_date, o.price, o.user_location, o.user_provider_location,
    JSON_BUILD_OBJECT(
        'price', s.price,
        'calification', s.calification,
        'category', c.name
    ) as service,
    JSON_BUILD_OBJECT(
        'identification_type_id', it.id,
        'identification_type', it.name,
        'identification', u.identification,
        'fullname', u.fullname,
        'email', u.email,
        'avatar_url', u.avatar_url,
        'phone', u.phone,
        'birthdate', u.birthdate,
        'role_id', r.id,
        'role', r.name
    ) as user
FROM dbo."Offert" o
INNER JOIN dbo."Service" s ON s.id = o.service_id
INNER JOIN dbo."Category" c ON c.id = s.category_id
INNER JOIN dbo."User" u ON u.id = o.user_id
INNER JOIN dbo."IdentificationType" it ON it.id = u.identification_type_id
INNER JOIN dbo."Role" r ON r.id = u.role_id
WHERE s.user_id = $1 AND ($2::integer IS NULL OR o.status_id = $2::integer)
ORDER BY
    CASE WHEN $3 = 'ASC' THEN o.price END ASC,
    CASE WHEN $3 = 'DESC' THEN o.price END DESC,
    agended_date DESC
LIMIT $4 OFFSET $5;`;