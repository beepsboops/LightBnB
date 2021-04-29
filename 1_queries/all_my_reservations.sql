-- MY ANSWER (Also works? Not sure. Output too large to see on screen)
SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
FROM reservations
JOIN property_reviews ON property_reviews.reservation_id = reservations.id
JOIN properties ON reservations.property_id = properties.id
WHERE reservations.guest_id = 1
AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10;

-- COMPASS ANSWER
-- SELECT properties.*, reservations.*, avg(rating) as average_rating
-- FROM reservations
-- JOIN properties ON reservations.property_id = properties.id
-- JOIN property_reviews ON properties.id = property_reviews.property_id
-- WHERE reservations.guest_id = 1
-- AND reservations.end_date < now()::date
-- GROUP BY properties.id, reservations.id
-- ORDER BY reservations.start_date
-- LIMIT 10;