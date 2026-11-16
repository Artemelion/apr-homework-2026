-- Index. Плюсы и минусы
-- Проектируем БД Hospital, ставим индексы и выполняем запросы

USE master;
GO

IF DB_ID('Hospital') IS NOT NULL
    DROP DATABASE Hospital;
GO

CREATE DATABASE Hospital;
GO

USE Hospital;
GO

------------------------------------------------------------
-- Таблицы
------------------------------------------------------------

CREATE TABLE Departments
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Building INT NOT NULL CHECK (Building BETWEEN 1 AND 5),
    Financing MONEY NOT NULL DEFAULT 0 CHECK (Financing >= 0),
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N'')
);

CREATE TABLE Diseases
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N'')
);

CREATE TABLE Doctors
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL CHECK (Name <> N''),
    Salary MONEY NOT NULL CHECK (Salary > 0),
    Surname NVARCHAR(50) NOT NULL CHECK (Surname <> N'')
);

CREATE TABLE Examinations
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N'')
);

CREATE TABLE Wards
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(20) NOT NULL UNIQUE CHECK (Name <> N''),
    Places INT NOT NULL CHECK (Places >= 1),
    DepartmentId INT NOT NULL REFERENCES Departments(Id)
);

CREATE TABLE DoctorsExaminations
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Date DATE NOT NULL DEFAULT GETDATE() CHECK (Date <= GETDATE()),
    DiseaseId INT NOT NULL REFERENCES Diseases(Id),
    DoctorId INT NOT NULL REFERENCES Doctors(Id),
    ExaminationId INT NOT NULL REFERENCES Examinations(Id),
    WardId INT NOT NULL REFERENCES Wards(Id)
);

CREATE TABLE Interns
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    DoctorId INT NOT NULL REFERENCES Doctors(Id)
);

CREATE TABLE Professors
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    DoctorId INT NOT NULL REFERENCES Doctors(Id)
);
GO

------------------------------------------------------------
-- Данные
------------------------------------------------------------

INSERT INTO Departments (Building, Financing, Name) VALUES
(5, 35000, N'Ophthalmology'),
(5, 18000, N'Physiotherapy'),
(3, 25000, N'Cardiology'),
(1, 12000, N'Neurology'),
(4, 9000, N'Dermatology');

INSERT INTO Diseases (Name) VALUES
(N'Myopia'), (N'Back pain'), (N'Arrhythmia'), (N'Migraine'), (N'Eczema'), (N'Flu');

INSERT INTO Doctors (Name, Surname, Salary) VALUES
(N'Ivan', N'Petrenko', 3200),    -- 1 профессор
(N'Olena', N'Shevchenko', 2500), -- 2
(N'Andrii', N'Kovalenko', 1200), -- 3 интерн
(N'Maria', N'Bondarenko', 2900), -- 4 профессор
(N'Taras', N'Melnyk', 2100),     -- 5 интерн
(N'Iryna', N'Tkachenko', 1800);  -- 6 не проводит обследования

INSERT INTO Interns (DoctorId) VALUES (3), (5);
INSERT INTO Professors (DoctorId) VALUES (1), (4);

INSERT INTO Examinations (Name) VALUES
(N'Eye test'), (N'Massage'), (N'ECG'), (N'MRI'), (N'Blood test');

INSERT INTO Wards (Name, Places, DepartmentId) VALUES
(N'O-1', 20, 1),
(N'O-2', 6, 1),
(N'P-1', 4, 2),
(N'C-1', 10, 3),
(N'C-2', 8, 3),
(N'N-1', 12, 4),
(N'D-1', 25, 5);

INSERT INTO DoctorsExaminations (Date, DiseaseId, DoctorId, ExaminationId, WardId) VALUES
(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 1, 1, 1, 1),   -- Ophthalmology, профессор
(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 1, 3, 1, 2),   -- Ophthalmology, интерн
(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)), 2, 1, 2, 3),   -- Physiotherapy, профессор
(DATEADD(DAY, -20, CAST(GETDATE() AS DATE)), 3, 4, 3, 4),  -- Cardiology
(DATEADD(DAY, -15, CAST(GETDATE() AS DATE)), 3, 5, 3, 5),  -- Cardiology, интерн
(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)), 4, 2, 4, 6);   -- Neurology
GO

------------------------------------------------------------
-- Индексы
-- + поиск и JOIN по этим полям быстрее
-- - вставка/изменение медленнее и индекс занимает место, поэтому ставим только там, где часто ищем
------------------------------------------------------------

CREATE INDEX IX_Wards_DepartmentId ON Wards(DepartmentId);
CREATE INDEX IX_DoctorsExaminations_DoctorId ON DoctorsExaminations(DoctorId);
CREATE INDEX IX_DoctorsExaminations_WardId ON DoctorsExaminations(WardId);
CREATE INDEX IX_DoctorsExaminations_DiseaseId ON DoctorsExaminations(DiseaseId);
CREATE INDEX IX_DoctorsExaminations_Date ON DoctorsExaminations(Date);
CREATE INDEX IX_Departments_Building ON Departments(Building);
GO

------------------------------------------------------------
-- Запросы
------------------------------------------------------------

-- 1. Палаты 5-го корпуса на 5 и больше мест, если в этом корпусе есть палата больше чем на 15 мест
SELECT w.Name, w.Places
FROM Wards w
JOIN Departments d ON d.Id = w.DepartmentId
WHERE d.Building = 5
  AND w.Places >= 5
  AND EXISTS (
      SELECT 1
      FROM Wards w2
      JOIN Departments d2 ON d2.Id = w2.DepartmentId
      WHERE d2.Building = 5 AND w2.Places > 15
  );

-- 2. Отделения, в которых было хотя бы одно обследование за последнюю неделю
SELECT d.Name
FROM Departments d
WHERE EXISTS (
    SELECT 1
    FROM DoctorsExaminations de
    JOIN Wards w ON w.Id = de.WardId
    WHERE w.DepartmentId = d.Id
      AND de.Date >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
);

-- 3. Заболевания, для которых не проводятся обследования
SELECT ds.Name
FROM Diseases ds
WHERE NOT EXISTS (
    SELECT 1 FROM DoctorsExaminations de WHERE de.DiseaseId = ds.Id
);

-- 4. Полные имена врачей, которые не проводят обследования
SELECT dr.Name + N' ' + dr.Surname AS FullName
FROM Doctors dr
WHERE NOT EXISTS (
    SELECT 1 FROM DoctorsExaminations de WHERE de.DoctorId = dr.Id
);

-- 5. Отделения, в которых не проводятся обследования
SELECT d.Name
FROM Departments d
WHERE NOT EXISTS (
    SELECT 1
    FROM DoctorsExaminations de
    JOIN Wards w ON w.Id = de.WardId
    WHERE w.DepartmentId = d.Id
);

-- 6. Фамилии врачей-интернов
SELECT dr.Surname
FROM Doctors dr
JOIN Interns i ON i.DoctorId = dr.Id;

-- 7. Интерны, у которых ставка больше, чем у хотя бы одного врача (не интерна)
SELECT dr.Surname
FROM Doctors dr
JOIN Interns i ON i.DoctorId = dr.Id
WHERE dr.Salary > ANY (
    SELECT d2.Salary
    FROM Doctors d2
    WHERE d2.Id NOT IN (SELECT DoctorId FROM Interns)
);

-- 8. Палаты, вместимость которых больше, чем у каждой палаты 3-го корпуса
SELECT w.Name
FROM Wards w
WHERE w.Places > ALL (
    SELECT w2.Places
    FROM Wards w2
    JOIN Departments d2 ON d2.Id = w2.DepartmentId
    WHERE d2.Building = 3
);

-- 9. Врачи, которые проводят обследования и в Ophthalmology, и в Physiotherapy
SELECT dr.Surname
FROM Doctors dr
JOIN DoctorsExaminations de ON de.DoctorId = dr.Id
JOIN Wards w ON w.Id = de.WardId
JOIN Departments d ON d.Id = w.DepartmentId
WHERE d.Name IN (N'Ophthalmology', N'Physiotherapy')
GROUP BY dr.Id, dr.Surname
HAVING COUNT(DISTINCT d.Name) = 2;

-- 10. Отделения, в которых работают и интерны, и профессоры
SELECT d.Name
FROM Departments d
WHERE EXISTS (
    SELECT 1
    FROM DoctorsExaminations de
    JOIN Wards w ON w.Id = de.WardId
    JOIN Interns i ON i.DoctorId = de.DoctorId
    WHERE w.DepartmentId = d.Id
)
AND EXISTS (
    SELECT 1
    FROM DoctorsExaminations de
    JOIN Wards w ON w.Id = de.WardId
    JOIN Professors p ON p.DoctorId = de.DoctorId
    WHERE w.DepartmentId = d.Id
);

-- 11. Врачи и отделения, где они проводят обследования, если финансирование отделения больше 20000
SELECT DISTINCT dr.Name + N' ' + dr.Surname AS FullName, d.Name AS Department
FROM Doctors dr
JOIN DoctorsExaminations de ON de.DoctorId = dr.Id
JOIN Wards w ON w.Id = de.WardId
JOIN Departments d ON d.Id = w.DepartmentId
WHERE d.Financing > 20000;

-- 12. Отделение, в котором проводит обследования врач с наибольшей ставкой
SELECT DISTINCT d.Name
FROM Departments d
JOIN Wards w ON w.DepartmentId = d.Id
JOIN DoctorsExaminations de ON de.WardId = w.Id
WHERE de.DoctorId = (
    SELECT TOP 1 Id FROM Doctors ORDER BY Salary DESC
);

-- 13. Заболевания и количество обследований по ним
SELECT ds.Name, COUNT(de.Id) AS ExaminationsCount
FROM Diseases ds
LEFT JOIN DoctorsExaminations de ON de.DiseaseId = ds.Id
GROUP BY ds.Name;
