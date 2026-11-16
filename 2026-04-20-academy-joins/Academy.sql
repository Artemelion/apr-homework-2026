-- Объединение результатов. Нормальные формы
-- 1. Проектируем БД Academy скриптом
-- 2. Заполняем по 3 строки в каждой таблице
-- 3. Выполняем запросы

USE master;
GO

IF DB_ID('Academy') IS NOT NULL
    DROP DATABASE Academy;
GO

CREATE DATABASE Academy;
GO

USE Academy;
GO

------------------------------------------------------------
-- 1. Таблицы
------------------------------------------------------------

CREATE TABLE Teachers
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL CHECK (Name <> N''),
    Surname NVARCHAR(50) NOT NULL CHECK (Surname <> N'')
);

CREATE TABLE Assistants
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    TeacherId INT NOT NULL REFERENCES Teachers(Id)
);

CREATE TABLE Curators
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    TeacherId INT NOT NULL REFERENCES Teachers(Id)
);

CREATE TABLE Deans
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    TeacherId INT NOT NULL REFERENCES Teachers(Id)
);

CREATE TABLE Heads
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    TeacherId INT NOT NULL REFERENCES Teachers(Id)
);

CREATE TABLE Faculties
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Building INT NOT NULL CHECK (Building BETWEEN 1 AND 6),
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N''),
    DeanId INT NOT NULL REFERENCES Deans(Id)
);

CREATE TABLE Departments
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Building INT NOT NULL CHECK (Building BETWEEN 1 AND 6),
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N''),
    FacultyId INT NOT NULL REFERENCES Faculties(Id),
    HeadId INT NOT NULL REFERENCES Heads(Id)
);

CREATE TABLE Groups
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(10) NOT NULL UNIQUE CHECK (Name <> N''),
    Year INT NOT NULL CHECK (Year BETWEEN 1 AND 5),
    DepartmentId INT NOT NULL REFERENCES Departments(Id)
);

CREATE TABLE GroupsCurators
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    CuratorId INT NOT NULL REFERENCES Curators(Id),
    GroupId INT NOT NULL REFERENCES Groups(Id)
);

CREATE TABLE Subjects
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE CHECK (Name <> N'')
);

CREATE TABLE Lectures
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    SubjectId INT NOT NULL REFERENCES Subjects(Id),
    TeacherId INT NOT NULL REFERENCES Teachers(Id)
);

CREATE TABLE GroupsLectures
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    GroupId INT NOT NULL REFERENCES Groups(Id),
    LectureId INT NOT NULL REFERENCES Lectures(Id)
);

CREATE TABLE LectureRooms
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Building INT NOT NULL CHECK (Building BETWEEN 1 AND 6),
    Name NVARCHAR(10) NOT NULL UNIQUE CHECK (Name <> N'')
);

CREATE TABLE Schedules
(
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    Class INT NOT NULL CHECK (Class BETWEEN 1 AND 8),
    DayOfWeek INT NOT NULL CHECK (DayOfWeek BETWEEN 1 AND 7),
    Week INT NOT NULL CHECK (Week BETWEEN 1 AND 52),
    LectureId INT NOT NULL REFERENCES Lectures(Id),
    LectureRoomId INT NOT NULL REFERENCES LectureRooms(Id)
);
GO

------------------------------------------------------------
-- 2. Данные (по 3 строки)
------------------------------------------------------------

INSERT INTO Teachers (Name, Surname) VALUES
(N'Edward', N'Hopper'),
(N'Alex', N'Carmack'),
(N'Linda', N'Brown');

INSERT INTO Deans (TeacherId) VALUES (1), (2), (3);
INSERT INTO Heads (TeacherId) VALUES (1), (2), (3);
INSERT INTO Curators (TeacherId) VALUES (3), (1), (2);
INSERT INTO Assistants (TeacherId) VALUES (2), (3), (1);

INSERT INTO Faculties (Building, Name, DeanId) VALUES
(1, N'Computer Science', 1),
(2, N'Mathematics', 2),
(3, N'Design', 3);

INSERT INTO Departments (Building, Name, FacultyId, HeadId) VALUES
(2, N'Software Development', 1, 1),
(4, N'Applied Mathematics', 2, 2),
(5, N'Graphic Design', 3, 3);

INSERT INTO Groups (Name, Year, DepartmentId) VALUES
(N'F505', 5, 1),
(N'M101', 1, 2),
(N'D505', 5, 3);

-- куратор 1 (Linda) ведёт F505, куратор 2 (Edward) - M101, куратор 3 (Alex) - D505
INSERT INTO GroupsCurators (CuratorId, GroupId) VALUES
(1, 1), (2, 2), (3, 3);

INSERT INTO Subjects (Name) VALUES
(N'Databases'), (N'Algorithms'), (N'Web Design');

INSERT INTO Lectures (SubjectId, TeacherId) VALUES
(1, 2),  -- Databases - Alex Carmack
(2, 1),  -- Algorithms - Edward Hopper
(3, 3);  -- Web Design - Linda Brown

INSERT INTO GroupsLectures (GroupId, LectureId) VALUES
(1, 1),  -- F505 - Databases
(1, 2),  -- F505 - Algorithms
(3, 3);  -- D505 - Web Design

INSERT INTO LectureRooms (Building, Name) VALUES
(6, N'A311'),
(6, N'A104'),
(2, N'B201');

-- DayOfWeek: 1 - понедельник ... 7 - воскресенье
INSERT INTO Schedules (Class, DayOfWeek, Week, LectureId, LectureRoomId) VALUES
(1, 1, 1, 2, 1),  -- понедельник, 1 пара, Edward Hopper в A311
(3, 3, 2, 1, 2),  -- среда 2-й недели, 3 пара, Alex Carmack в A104
(2, 2, 1, 3, 3);  -- вторник, 2 пара, Linda Brown в B201
GO

------------------------------------------------------------
-- 3. Запросы
------------------------------------------------------------

-- 1. Аудитории, в которых читает лекции Edward Hopper
SELECT DISTINCT lr.Name
FROM LectureRooms lr
JOIN Schedules s ON s.LectureRoomId = lr.Id
JOIN Lectures l ON l.Id = s.LectureId
JOIN Teachers t ON t.Id = l.TeacherId
WHERE t.Name = N'Edward' AND t.Surname = N'Hopper';

-- 2. Фамилии ассистентов, читающих лекции в группе F505
SELECT DISTINCT t.Surname
FROM Assistants a
JOIN Teachers t ON t.Id = a.TeacherId
JOIN Lectures l ON l.TeacherId = t.Id
JOIN GroupsLectures gl ON gl.LectureId = l.Id
JOIN Groups g ON g.Id = gl.GroupId
WHERE g.Name = N'F505';

-- 3. Дисциплины, которые читает Alex Carmack для групп 5-го курса
SELECT DISTINCT sb.Name
FROM Subjects sb
JOIN Lectures l ON l.SubjectId = sb.Id
JOIN Teachers t ON t.Id = l.TeacherId
JOIN GroupsLectures gl ON gl.LectureId = l.Id
JOIN Groups g ON g.Id = gl.GroupId
WHERE t.Name = N'Alex' AND t.Surname = N'Carmack' AND g.Year = 5;

-- 4. Фамилии преподавателей, которые не читают лекции по понедельникам
SELECT t.Surname
FROM Teachers t
WHERE NOT EXISTS (
    SELECT 1
    FROM Lectures l
    JOIN Schedules s ON s.LectureId = l.Id
    WHERE l.TeacherId = t.Id AND s.DayOfWeek = 1
);

-- 5. Аудитории с корпусами, в которых нет лекций в среду второй недели на третьей паре
SELECT lr.Name, lr.Building
FROM LectureRooms lr
WHERE NOT EXISTS (
    SELECT 1
    FROM Schedules s
    WHERE s.LectureRoomId = lr.Id
      AND s.DayOfWeek = 3
      AND s.Week = 2
      AND s.Class = 3
);

-- 6. Преподаватели факультета Computer Science, которые не курируют группы кафедры Software Development
SELECT DISTINCT t.Name + N' ' + t.Surname AS FullName
FROM Teachers t
JOIN Lectures l ON l.TeacherId = t.Id
JOIN GroupsLectures gl ON gl.LectureId = l.Id
JOIN Groups g ON g.Id = gl.GroupId
JOIN Departments d ON d.Id = g.DepartmentId
JOIN Faculties f ON f.Id = d.FacultyId
WHERE f.Name = N'Computer Science'
  AND t.Id NOT IN (
      SELECT c.TeacherId
      FROM Curators c
      JOIN GroupsCurators gc ON gc.CuratorId = c.Id
      JOIN Groups g2 ON g2.Id = gc.GroupId
      JOIN Departments d2 ON d2.Id = g2.DepartmentId
      WHERE d2.Name = N'Software Development'
  );

-- 7. Номера всех корпусов из таблиц факультетов, кафедр и аудиторий
SELECT Building FROM Faculties
UNION
SELECT Building FROM Departments
UNION
SELECT Building FROM LectureRooms;

-- 8. Полные имена: деканы, заведующие, преподаватели, кураторы, ассистенты
SELECT FullName, Role
FROM (
    SELECT t.Name + N' ' + t.Surname AS FullName, N'Dean' AS Role, 1 AS Ord
    FROM Deans d JOIN Teachers t ON t.Id = d.TeacherId
    UNION ALL
    SELECT t.Name + N' ' + t.Surname, N'Head', 2
    FROM Heads h JOIN Teachers t ON t.Id = h.TeacherId
    UNION ALL
    SELECT t.Name + N' ' + t.Surname, N'Teacher', 3
    FROM Teachers t
    UNION ALL
    SELECT t.Name + N' ' + t.Surname, N'Curator', 4
    FROM Curators c JOIN Teachers t ON t.Id = c.TeacherId
    UNION ALL
    SELECT t.Name + N' ' + t.Surname, N'Assistant', 5
    FROM Assistants a JOIN Teachers t ON t.Id = a.TeacherId
) AS AllRoles
ORDER BY Ord, FullName;

-- 9. Дни недели (без повторений), когда есть занятия в A311 и A104 корпуса 6
SELECT DISTINCT s.DayOfWeek
FROM Schedules s
JOIN LectureRooms lr ON lr.Id = s.LectureRoomId
WHERE lr.Name IN (N'A311', N'A104') AND lr.Building = 6;
