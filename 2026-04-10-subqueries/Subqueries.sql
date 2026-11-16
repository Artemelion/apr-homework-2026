-- Коррелированные и некоррелированные подзапросы
-- База Library

USE Library;
GO

--1. Студенты, которые брали больше книг, чем в среднем по всем студентам
-- некоррелированный подзапрос: среднее считается один раз
SELECT s.FirstName, s.LastName, COUNT(sc.Id) AS BooksCount
FROM Students s
JOIN S_Cards sc ON sc.Id_Student = s.Id
GROUP BY s.Id, s.FirstName, s.LastName
HAVING COUNT(sc.Id) >
(
    SELECT AVG(CAST(t.Cnt AS FLOAT))
    FROM (
        SELECT COUNT(*) AS Cnt
        FROM S_Cards
        GROUP BY Id_Student
    ) t
);

--2. Книги, которые выдавались хотя бы одному студенту из той же группы
-- (то есть книгу брали минимум два разных студента одной группы)
-- коррелированный подзапрос: использует sc1 из внешнего запроса
SELECT DISTINCT b.Name
FROM Books b
JOIN S_Cards sc1 ON sc1.Id_Book = b.Id
JOIN Students s1 ON s1.Id = sc1.Id_Student
WHERE EXISTS (
    SELECT 1
    FROM S_Cards sc2
    JOIN Students s2 ON s2.Id = sc2.Id_Student
    WHERE sc2.Id_Book = sc1.Id_Book
      AND s2.Id_Group = s1.Id_Group
      AND s2.Id <> s1.Id
);

--3. Студенты, у которых есть просроченные книги (DateOut < DateIn)
-- коррелированный подзапрос
SELECT s.FirstName, s.LastName
FROM Students s
WHERE EXISTS (
    SELECT 1
    FROM S_Cards sc
    WHERE sc.Id_Student = s.Id
      AND sc.DateOut < sc.DateIn
);

--4. Издательства, у которых есть книги с количеством меньше среднего
-- некоррелированный подзапрос внутри коррелированного
SELECT p.Name
FROM Press p
WHERE EXISTS (
    SELECT 1
    FROM Books b
    WHERE b.Id_Press = p.Id
      AND b.Quantity < (SELECT AVG(Quantity) FROM Books)
);
