-- Рефакторинг. Декомпозиция БД
-- Из однотабличной базы book делаем многотабличную (6 таблиц)

USE master;
GO

IF DB_ID('BooksDb') IS NOT NULL
    DROP DATABASE BooksDb;
GO

CREATE DATABASE BooksDb;
GO

USE BooksDb;
GO

------------------------------------------------------------
-- 1. Таблицы
------------------------------------------------------------

CREATE TABLE Publishers
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Categories
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Themes
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Formats
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Authors
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL
);

CREATE TABLE Books
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Code INT NOT NULL UNIQUE,
    Name NVARCHAR(200) NULL,
    Price MONEY NULL CHECK (Price >= 0),
    Pages INT NULL CHECK (Pages > 0),
    Date DATE NULL,
    Pressrun INT NULL,
    IsNew BIT NOT NULL DEFAULT 0,
    PublisherId INT NULL REFERENCES Publishers(Id),
    CategoryId INT NULL REFERENCES Categories(Id),
    ThemeId INT NULL REFERENCES Themes(Id),
    FormatId INT NULL REFERENCES Formats(Id),
    AuthorId INT NULL REFERENCES Authors(Id)
);
GO

------------------------------------------------------------
-- 2. Данные
------------------------------------------------------------

INSERT INTO Publishers (Name) VALUES
(N'БХВ-Петербург'), (N'Питер'), (N'Диалектика'), (N'Альфа Пресс'), (N'Наука Пресс'), (N'Эксмо');

INSERT INTO Categories (Name) VALUES
(N'Учебная литература'), (N'Учебные пособия'), (N'Художественная'), (N'Справочники'), (N'Научно-популярная');

INSERT INTO Themes (Name) VALUES
(N'Программирование'), (N'Базы данных'), (N'Сети'), (N'Веб разработка'), (N'Операционные системы'), (N'Фантастика');

INSERT INTO Formats (Name) VALUES
(N'60x84/16'), (N'70x100/16'), (N'84x108/32'), (N'A4'), (N'A4 мягкая обложка');

INSERT INTO Authors (FirstName, LastName) VALUES
(N'Роберт', N'Мартин'), (N'Эндрю', N'Таненбаум'), (N'Герберт', N'Шилдт'), (N'Брюс', N'Эккель'), (N'Айзек', N'Азимов'), (N'Кайл', N'Симпсон');

INSERT INTO Books (Code, Name, Price, Pages, Date, Pressrun, IsNew, PublisherId, CategoryId, ThemeId, FormatId, AuthorId) VALUES
(101, N'Алгоритмы и структуры данных', 450, 384, '2019-03-15', 3000, 0, 1, 1, 1, 1, 1),
(102, N'Java. Полное руководство', 890, 1488, '2020-06-01', 5000, 1, 3, 2, 1, 2, 3),
(103, N'Изучаем C# на примерах', 620, 512, '2021-02-10', 4000, 1, 2, 1, 1, 1, 3),
(104, N'Компьютерные сети', 750, 960, '2020-09-20', 3500, 0, 2, 1, 3, 2, 2),
(105, N'SQL для начинающих', 380, 320, '2018-11-05', 2000, 0, 4, 2, 2, 4, 1),
(106, N'Основание', 290, 352, '2017-04-12', 10000, 0, 6, 3, 6, 3, 5),
(107, N'Современные операционные системы', 990, NULL, '2020-01-30', 3000, 1, 2, 4, 5, 5, 2),
(108, N'Философия Java', 830, 1168, '2022-05-18', 4500, 1, 2, 1, 1, 2, 4),
(109, N'Вы не знаете JS', 410, 280, '2020-12-01', 2500, 0, 5, 2, 4, 4, 6),
(110, N'Азбука веб разработки', 300, 240, '2023-03-03', 1500, 1, 4, 5, 4, 1, 6);
GO

------------------------------------------------------------
-- 3. Запросы
------------------------------------------------------------

------ SELECT + LIKE

-- Все книги, название которых начинается на букву "А"
SELECT Code, Name FROM Books
WHERE Name LIKE N'А%';

-- Книги, в названии которых есть слово "Java"
SELECT Code, Name FROM Books
WHERE Name LIKE N'%Java%';

-- Книги, издательство которых заканчивается на "Пресс"
SELECT b.Code, b.Name, p.Name AS Publisher
FROM Books b
JOIN Publishers p ON p.Id = b.PublisherId
WHERE p.Name LIKE N'%Пресс';

-- Книги определённого формата, содержащего строку "A4"
SELECT b.Code, b.Name, f.Name AS Format
FROM Books b
JOIN Formats f ON f.Id = b.FormatId
WHERE f.Name LIKE N'%A4%';

-- Книги, категория которых содержит слово "Учеб"
SELECT b.Code, b.Name, c.Name AS Category
FROM Books b
JOIN Categories c ON c.Id = b.CategoryId
WHERE c.Name LIKE N'%Учеб%';

-- Книги, у которых тема содержит хотя бы два слова (есть пробел внутри)
SELECT b.Code, b.Name, t.Name AS Theme
FROM Books b
JOIN Themes t ON t.Id = b.ThemeId
WHERE LTRIM(RTRIM(t.Name)) LIKE N'% %';

-- Все новые книги
SELECT Code, Name FROM Books
WHERE IsNew = 1;

-- Книги дороже 500
SELECT Code, Name, Price FROM Books
WHERE Price > 500;

-- Книги, опубликованные в 2020 году
SELECT Code, Name, Date FROM Books
WHERE YEAR(Date) = 2020;

-- Книги, у которых не указано количество страниц
SELECT Code, Name FROM Books
WHERE Pages IS NULL;

------ INSERT

-- Новая книга с полями Code, Name, Price, издательство, Date
INSERT INTO Books (Code, Name, Price, PublisherId, Date)
VALUES (111, N'Чистый код', 700, 2, '2021-08-10');

-- Книга только с Code, Name и Category
INSERT INTO Books (Code, Name, CategoryId)
VALUES (112, N'Справочник по Python', 4);

-- Книга без даты публикации
INSERT INTO Books (Code, Name, Price, PublisherId, CategoryId)
VALUES (113, N'Основы TypeScript', 520, 3, 2);

-- Книга категории "Художественная"
INSERT INTO Books (Code, Name, Price, CategoryId, ThemeId, AuthorId)
VALUES (114, N'Я, робот', 260,
        (SELECT Id FROM Categories WHERE Name = N'Художественная'), 6, 5);

-- Новая книга
INSERT INTO Books (Code, Name, Price, Pages, Date, IsNew, PublisherId, CategoryId, ThemeId, FormatId)
VALUES (115, N'Angular для начинающих', 640, 420, '2024-02-01', 1, 1, 2, 4, 1);

------ UPDATE

-- Изменить цену всех книг, в названии которых есть "C#" (поднимаем на 10%)
UPDATE Books
SET Price = Price * 1.1
WHERE Name LIKE N'%C#%';

-- Пометить книгу с заданным id как новую
UPDATE Books
SET IsNew = 1
WHERE Id = 4;

-- Изменить издательство всех книг категории "Учебная литература"
UPDATE Books
SET PublisherId = (SELECT Id FROM Publishers WHERE Name = N'Питер')
WHERE CategoryId = (SELECT Id FROM Categories WHERE Name = N'Учебная литература');

------ DELETE

-- Удалить книгу по коду
DELETE FROM Books
WHERE Code = 112;

-- Удалить все книги, у которых название пустое или NULL
DELETE FROM Books
WHERE Name IS NULL OR LTRIM(RTRIM(Name)) = N'';

SELECT * FROM Books;
