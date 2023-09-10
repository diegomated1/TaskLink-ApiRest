export const QUERY_favorites =  `
SELECT 
u.id, u.identification, u.fullname, u.email, u.avatar_url, u.phone, u.birthdate, u.identification_type_id, u.role_id,
r.name as role, it.name as identification_type,
(
    SELECT jsonb_agg(
        json_build_object(
            'price', s.price,
            'calification', s.calification, 
            'category', c.name,
            'description', s.description
        )
    )
    FROM dbo."Service" s
    INNER JOIN dbo."Category" c ON c.id = s.category_id
    WHERE s.user_id = u.id
) as services
FROM dbo."Favorite" f 
INNER JOIN dbo."User" u ON u.id = f.service_provider_id 
INNER JOIN dbo."Role" r ON r.id = u.role_id
INNER JOIN dbo."IdentificationType" it on it.id = u.identification_type_id
WHERE f.user_id = $1
`;