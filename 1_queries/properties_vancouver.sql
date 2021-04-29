-- MY ANSWER (DIDN'T WORK)
SELECT properties.id, properties.title, properties.cost_per_night, properties.city, (SELECT AVG(property_reviews.rating) as average_rating FROM property_reviews GROUP BY property_reviews.rating)
FROM properties
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE city = 'Vancouver'
-- AND AVG(property_reviews.rating >= 4
GROUP BY properties.id
ORDER BY cost_per_night

-- COMPASS ANSWER
SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;