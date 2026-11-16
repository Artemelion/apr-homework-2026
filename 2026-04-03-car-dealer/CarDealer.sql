-- Проектирование БД. Алиасы для таблиц
-- Из однотабличной базы CarDealer делаем многотабличную и заполняем по 5 записей

USE master;
GO

IF DB_ID('CarDealerShop') IS NOT NULL
    DROP DATABASE CarDealerShop;
GO

CREATE DATABASE CarDealerShop;
GO

USE CarDealerShop;
GO

------------------------------------------------------------
-- Таблицы
------------------------------------------------------------

CREATE TABLE Brands
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Models
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    BrandId INT NOT NULL REFERENCES Brands(Id)
);

CREATE TABLE Colors
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE EngineTypes
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Statuses
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Cars
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    VIN NVARCHAR(17) NOT NULL UNIQUE,
    ModelId INT NOT NULL REFERENCES Models(Id),
    ColorId INT NOT NULL REFERENCES Colors(Id),
    EngineTypeId INT NOT NULL REFERENCES EngineTypes(Id),
    StatusId INT NOT NULL REFERENCES Statuses(Id),
    Year INT NOT NULL CHECK (Year BETWEEN 1950 AND 2030),
    Mileage INT NOT NULL CHECK (Mileage >= 0),
    Price MONEY NOT NULL CHECK (Price > 0)
);
GO

------------------------------------------------------------
-- Данные (по 5 записей)
------------------------------------------------------------

INSERT INTO Brands (Name) VALUES
(N'Toyota'), (N'Honda'), (N'BMW'), (N'Volkswagen'), (N'Ford');

INSERT INTO Models (Name, BrandId) VALUES
(N'Corolla', 1), (N'Civic', 2), (N'X5', 3), (N'Golf', 4), (N'Focus', 5);

INSERT INTO Colors (Name) VALUES
(N'Black'), (N'White'), (N'Red'), (N'Blue'), (N'Silver');

INSERT INTO EngineTypes (Name) VALUES
(N'Petrol'), (N'Diesel'), (N'Hybrid'), (N'Electric'), (N'Plug-in Hybrid');

INSERT INTO Statuses (Name) VALUES
(N'available'), (N'reserved'), (N'sold'), (N'service'), (N'archived');

INSERT INTO Cars (VIN, ModelId, ColorId, EngineTypeId, StatusId, Year, Mileage, Price) VALUES
(N'JTDBR32E720012345', 1, 2, 3, 1, 2018, 85000, 14500),
(N'2HGFC2F59KH512345', 2, 1, 1, 3, 2016, 120000, 11000),
(N'WBAKS410X00C12345', 3, 1, 2, 1, 2020, 45000, 42000),
(N'WVWZZZ1KZ8W123456', 4, 4, 1, 2, 2012, 210000, 6500),
(N'1FADP3F20EL123456', 5, 3, 1, 3, 2014, 150000, 7800);
GO

------------------------------------------------------------
-- Запросы (c, m, b и т.д. - алиасы таблиц)
------------------------------------------------------------

-- 1. Все автомобили марки Toyota (LIKE)
SELECT c.VIN, b.Name AS Brand, m.Name AS Model, c.Price
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
JOIN Brands b ON b.Id = m.BrandId
WHERE b.Name LIKE N'Toyota%';

-- 2. Все модели, в названии которых есть буква "o"
SELECT m.Name
FROM Models m
WHERE m.Name LIKE N'%o%';

-- 3. VIN-номера, которые начинаются с буквы "W"
SELECT c.VIN
FROM Cars c
WHERE c.VIN LIKE N'W%';

-- 4. Добавить новый автомобиль
INSERT INTO Cars (VIN, ModelId, ColorId, EngineTypeId, StatusId, Year, Mileage, Price)
VALUES (N'JTDKN3DU5A0123456', 1, 5, 3, 1, 2021, 30000, 19500);

-- 5. Поднять цену всех Toyota на 5%
UPDATE c
SET c.Price = c.Price * 1.05
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
JOIN Brands b ON b.Id = m.BrandId
WHERE b.Name = N'Toyota';

-- 6. Статус всех проданных машин поменять на "archived"
UPDATE Cars
SET StatusId = (SELECT Id FROM Statuses WHERE Name = N'archived')
WHERE StatusId = (SELECT Id FROM Statuses WHERE Name = N'sold');

-- 7. Удалить автомобили с пробегом больше 200000 км
DELETE FROM Cars
WHERE Mileage > 200000;

-- 8. Удалить машины, у которых в VIN есть буква "X"
DELETE FROM Cars
WHERE VIN LIKE N'%X%';

-- 9. Цвет всех машин модели Civic поменять на "Silver"
UPDATE c
SET c.ColorId = (SELECT Id FROM Colors WHERE Name = N'Silver')
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
WHERE m.Name = N'Civic';

-- 10. Добавить 2 новых авто одной командой
INSERT INTO Cars (VIN, ModelId, ColorId, EngineTypeId, StatusId, Year, Mileage, Price) VALUES
(N'2HGFE2F50NH123456', 2, 2, 1, 1, 2022, 15000, 23000),
(N'WAUZZZ8V5KA123456', 4, 1, 4, 1, 2019, 60000, 16000);

-- 11. Автомобили дороже 15000$
SELECT c.VIN, m.Name AS Model, c.Price
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
WHERE c.Price > 15000;

-- 12. Автомобили, выпущенные с 2015 по 2020 год
SELECT c.VIN, m.Name AS Model, c.Year
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
WHERE c.Year BETWEEN 2015 AND 2020;

-- 13. Машины с пробегом меньше 100000 км
SELECT c.VIN, m.Name AS Model, c.Mileage
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
WHERE c.Mileage < 100000;

-- 14. Автомобили с гибридным двигателем (LIKE)
SELECT c.VIN, m.Name AS Model, e.Name AS Engine
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
JOIN EngineTypes e ON e.Id = c.EngineTypeId
WHERE e.Name LIKE N'%Hybrid%';

-- 15. Все машины, цвет которых не Black
SELECT c.VIN, m.Name AS Model, cl.Name AS Color
FROM Cars c
JOIN Models m ON m.Id = c.ModelId
JOIN Colors cl ON cl.Id = c.ColorId
WHERE cl.Name <> N'Black';
