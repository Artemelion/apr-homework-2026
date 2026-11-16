-- Пользовательские функции
-- База Library

USE Library;
GO

-- 1. Количество книг, написанных автором
CREATE FUNCTION fn_AuthorBooksCount (@AuthorId INT)
RETURNS INT
AS
BEGIN
    DECLARE @count INT;

    SELECT @count = COUNT(*)
    FROM Books
    WHERE Id_Author = @AuthorId;

    RETURN @count;
END;
GO

-- 2. Общее количество экземпляров книги
CREATE FUNCTION fn_BookCopies (@BookId INT)
RETURNS INT
AS
BEGIN
    DECLARE @copies INT;

    SELECT @copies = Quantity
    FROM Books
    WHERE Id = @BookId;

    RETURN ISNULL(@copies, 0);
END;
GO

-- 3. Количество книг на руках у преподавателя (ещё не вернул - DateIn пустая)
CREATE FUNCTION fn_TeacherBooksOnHands (@TeacherId INT)
RETURNS INT
AS
BEGIN
    DECLARE @count INT;

    SELECT @count = COUNT(*)
    FROM T_Cards
    WHERE Id_Teacher = @TeacherId
      AND DateIn IS NULL;

    RETURN @count;
END;
GO

-- 4. Самая ранняя дата выдачи книги (и студентам, и преподавателям)
CREATE FUNCTION fn_FirstIssueDate (@BookId INT)
RETURNS DATE
AS
BEGIN
    DECLARE @date DATE;

    SELECT @date = MIN(DateOut)
    FROM (
        SELECT DateOut FROM S_Cards WHERE Id_Book = @BookId
        UNION ALL
        SELECT DateOut FROM T_Cards WHERE Id_Book = @BookId
    ) AS AllCards;

    RETURN @date;
END;
GO

-- 5. Самый популярный автор: чьи книги выдавали чаще всего
CREATE FUNCTION fn_MostPopularAuthor ()
RETURNS INT
AS
BEGIN
    DECLARE @authorId INT;

    SELECT TOP 1 @authorId = b.Id_Author
    FROM (
        SELECT Id_Book FROM S_Cards
        UNION ALL
        SELECT Id_Book FROM T_Cards
    ) AS c
    JOIN Books b ON b.Id = c.Id_Book
    GROUP BY b.Id_Author
    ORDER BY COUNT(*) DESC;

    RETURN @authorId;
END;
GO

-- Проверка
SELECT dbo.fn_AuthorBooksCount(1) AS AuthorBooks;
SELECT dbo.fn_BookCopies(1) AS Copies;
SELECT dbo.fn_TeacherBooksOnHands(1) AS TeacherBooksOnHands;
SELECT dbo.fn_FirstIssueDate(1) AS FirstIssue;
SELECT dbo.fn_MostPopularAuthor() AS PopularAuthorId;

-- имя самого популярного автора
SELECT FirstName, LastName
FROM Authors
WHERE Id = dbo.fn_MostPopularAuthor();
