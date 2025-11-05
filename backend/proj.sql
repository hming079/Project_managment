-- CREATE DATABASE PROJECT_MANAGEMENT;
-- GO
-- USE PROJECT_MANAGEMENT;
-- GO
/* USE master;
GO
DROP DATABASE PROJECT_MANAGEMENT;
GO */
USE proj_mm
CREATE TABLE [USER] (
	ID INTEGER,
	FirstName NVARCHAR(25),
	LastName NVARCHAR(25),
	Email NVARCHAR(25),
	[Password] NVARCHAR(25),
	PhoneNum VARCHAR(10),
	[Role] NVARCHAR(25),
	CreatedTime DATETIME DEFAULT GETDATE(),
	LastUpdatedTime DATETIME,
	Status_System NVARCHAR(25),

	CONSTRAINT PK_USER PRIMARY KEY (ID),
	CONSTRAINT CHECK_EMAIL CHECK(Email LIKE '%_@%_.%_'),
	CONSTRAINT EMAIL_UNIQUE UNIQUE (Email),
	CONSTRAINT PHONE_CHECK CHECK( LEN(PhoneNum) = 10 
									AND PhoneNum LIKE '0%' 
									AND PhoneNum NOT LIKE '%[^0-9]%'),
	CONSTRAINT STATUS_CHECK CHECK (Status_System IN ('Active','Deactive')),
	CONSTRAINT ROLE_CHECK CHECK ([Role] IN ('PM', 'Participant', 'Admin'))
)
GO

CREATE TABLE PROJECT_MANAGER (
	UserID INTEGER,
	[EXP] NVARCHAR(100),
	Areas_Of_Expertise NVARCHAR(100),

	CONSTRAINT PK_PM PRIMARY KEY (UserID),
	CONSTRAINT FK_PM FOREIGN KEY (UserID) REFERENCES[USER](ID)
)
GO

CREATE TABLE DEGREES_AND_CERTIFICATES(
	PM_ID INTEGER,
	Degree_or_Certificate NVARCHAR (100),
	CONSTRAINT PK_DC PRIMARY KEY (PM_ID, Degree_or_Certificate),
	CONSTRAINT FK_DC FOREIGN KEY (PM_ID) REFERENCES[PROJECT_MANAGER](UserID)
)
GO

CREATE TABLE PARTICIPANT (
	UserID INTEGER,
	BioURL VARCHAR(100),
	Professional_Skills NVARCHAR(100),

	CONSTRAINT PK_PT PRIMARY KEY (UserID),
	CONSTRAINT FK_PT FOREIGN KEY (UserID) REFERENCES[USER](ID)
)
GO

CREATE TABLE PROJECT (
	ID INTEGER,
	[Name] NVARCHAR(50) NOT NULL,
	[Description] NVARCHAR(255),
	StartDate DATETIME NOT NULL,
	EndDate DATETIME NOT NULL,
	CreatedTime DATETIME DEFAULT GETDATE(),
	LastUpdatedTime DATETIME,
	[Status] NVARCHAR(25),
	CONSTRAINT PK_PJ PRIMARY KEY (ID),
	CONSTRAINT PROJECT_STATUS_CHECK CHECK ([Status] IN ('Open','Close','Archive'))
)
GO

CREATE TABLE TASK (
	PJ_ID INTEGER,
	[No] INTEGER,
	[Name] NVARCHAR(50) NOT NULL,
	[Priority] INTEGER,
	[Description] NVARCHAR(255),
	StartDate DATETIME NOT NULL,
	DueDate DATETIME NOT NULL,
	CreatedTime DATETIME DEFAULT GETDATE(),
	LastUpdatedTime DATETIME,
	CompletedDate DATETIME,
	[Status] NVARCHAR(25),
	CONSTRAINT PK_TASK PRIMARY KEY (PJ_ID, [No]),
	CONSTRAINT FK_TASK FOREIGN KEY (PJ_ID) REFERENCES PROJECT(ID),
	CONSTRAINT TASK_STATUS_CHECK CHECK ([Status] IN ('Todo','Open','InProgress','Done','Close'))
)
GO

CREATE TABLE PROJECT_MEMBER (
	UserID INTEGER,
	PJ_ID INTEGER,
	[Status] NVARCHAR(25) DEFAULT 'Working',
	CONSTRAINT PK_PMEM PRIMARY KEY (UserID, PJ_ID),
	CONSTRAINT FK_PMEM_USER FOREIGN KEY (UserID) REFERENCES [USER](ID),
	CONSTRAINT FK_PMEM_PROJECT FOREIGN KEY (PJ_ID) REFERENCES PROJECT(ID),
	CONSTRAINT PMEM_STATUS_CHECK CHECK ([Status] IN ('Working','Interupting','Stopping'))
)
GO

CREATE TABLE TASK_ASSIGN (
	UserID INTEGER,
	PJ_ID INTEGER,
	TaskNo INTEGER,
	CONSTRAINT PK_TA PRIMARY KEY (UserID, PJ_ID, TaskNo),
	CONSTRAINT FK_TA_USER FOREIGN KEY (UserID) REFERENCES [USER](ID),
	CONSTRAINT FK_TA_PROJECT FOREIGN KEY (PJ_ID, TaskNo) REFERENCES [TASK](PJ_ID, [No])
)
GO

CREATE TABLE [NOTIFICATION] (
	ID INTEGER IDENTITY(1,1),
	Content NVARCHAR(255) NOT NULL,
	ActionType NVARCHAR(25),
	Is_read BIT DEFAULT 0,
	CreatedTime DATETIME DEFAULT GETDATE(),
	SenderID INTEGER,
	ReceiverID INTEGER,
	PJ_ID INTEGER,
	TaskNo INTEGER,
	CONSTRAINT PK_NOTI PRIMARY KEY (ID),
	CONSTRAINT FK_NOTI_SENDER FOREIGN KEY (SenderID) REFERENCES [USER](ID),
	CONSTRAINT FK_NOTI_RECEIVER FOREIGN KEY (ReceiverID) REFERENCES [USER](ID),
	CONSTRAINT FK_NOTI_TASK FOREIGN KEY (PJ_ID, TaskNo) REFERENCES [TASK](PJ_ID, [No]),
	CONSTRAINT FK_NOTI_PROJECT FOREIGN KEY (PJ_ID) REFERENCES PROJECT(ID)
)
GO

CREATE TABLE COMMENT (
	ID INTEGER IDENTITY(1,1),
	Content NVARCHAR(255) NOT NULL,
	CreatedTime DATETIME DEFAULT GETDATE(),
	CreatorID INTEGER,
	PJ_ID INTEGER,
	TaskNo INTEGER,
	CONSTRAINT PK_CMT PRIMARY KEY (ID),
	CONSTRAINT FK_CMT_CREATOR FOREIGN KEY (CreatorID) REFERENCES [USER](ID),
	CONSTRAINT FK_CMT_TASK FOREIGN KEY (PJ_ID, TaskNo) REFERENCES [TASK](PJ_ID, [No]),
	CONSTRAINT FK_CMT_PROJECT FOREIGN KEY (PJ_ID) REFERENCES PROJECT(ID)
)
GO

﻿/*
============================================================
 SCRIPT TỔNG HỢP CHÈN TOÀN BỘ DATA MẪU
============================================================
*/

USE PROJECT_MANAGEMENT;
GO

/* -- Lệnh xóa toàn bộ Database
USE master;
GO
-- ALTER DATABASE PROJECT_MANAGEMENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
-- DROP DATABASE PROJECT_MANAGEMENT;
-- GO
-- Xóa dữ liệu (DELETE) theo thứ tự ngược lại để không vi phạm FK
DELETE FROM COMMENT;
DELETE FROM [NOTIFICATION];
DELETE FROM TASK_ASSIGN;
DELETE FROM PROJECT_MEMBER;
DELETE FROM TASK;
DELETE FROM DEGREES_AND_CERTIFICATES;
DELETE FROM PARTICIPANT;
DELETE FROM PROJECT_MANAGER;
DELETE FROM PROJECT;
DELETE FROM [USER];
*/


/*
============================================================
 PHẦN CHÈN DATA (INSERT)
============================================================
*/

-- ===== 1. DATA MẪU LẦN 1 =====

-- 1.1. TẠO NGƯỜI DÙNG (USER)
INSERT INTO [USER] (ID, FirstName, LastName, Email, [Password], PhoneNum, [Role], Status_System)
VALUES
(1, N'An', N'Nguyễn', N'admin@pm.com', N'admin123', '0905111222', 'Admin', 'Active'),
(2, N'Bình', N'Võ', N'binh.pm@pm.com', N'pass123', '0905333444', 'PM', 'Active'),
(3, N'Cúc', N'Trần', N'cuc.pm@pm.com', N'pass123', '0905555666', 'PM', 'Deactive'),
(4, N'Dũng', N'Lê', N'dung.dev@pm.com', N'pass123', '0905777888', 'Participant', 'Active'),
(5, N'Em', N'Hoa', N'em.design@pm.com', N'pass123', '0905999000', 'Participant', 'Active');
GO

-- 1.2. PHÂN VAI TRÒ: PROJECT MANAGER
INSERT INTO PROJECT_MANAGER (UserID, [EXP], Areas_Of_Expertise)
VALUES
(2, N'5 năm kinh nghiệm', N'Agile, Scrum, Quản lý rủi ro'),
(3, N'3 năm kinh nghiệm', N'Kanban, Jira, Quản lý team');
GO

-- 1.3. PHÂN VAI TRÒ: PARTICIPANT
INSERT INTO PARTICIPANT (UserID, BioURL, Professional_Skills)
VALUES
(4, 'github.com/dung-le', N'React.js, Node.js, SQL Server'),
(5, 'behance.net/em-hoa', N'UI/UX Design, Figma, Prototyping');
GO

-- 1.4. THÊM BẰNG CẤP CHO PM
INSERT INTO DEGREES_AND_CERTIFICATES (PM_ID, Degree_or_Certificate)
VALUES
(2, N'Certified ScrumMaster (CSM)'),
(2, N'B.S. Computer Science'),
(3, N'Project Management Professional (PMP)');
GO

-- 1.5. TẠO DỰ ÁN (PROJECT)
INSERT INTO PROJECT (ID, [Name], [Description], StartDate, EndDate, [Status])
VALUES
(1, N'Xây dựng E-commerce', N'Dự án xây dựng trang web thương mại điện tử', '2025-11-01', '2026-05-01', 'Open'),
(2, N'Phát triển Ứng dụng Mobile', N'Ứng dụng đặt đồ ăn nội bộ', '2025-06-01', '2025-10-30', 'Close');
GO

-- 1.6. TẠO TASK CHO DỰ ÁN
INSERT INTO TASK (PJ_ID, [No], [Name], [Priority], [Description], StartDate, DueDate, [Status])
VALUES
-- 3 Task cho Project 1 (ID=1)
(1, 1, N'Thiết kế Database', 1, N'Thiết kế ERD cho toàn hệ thống', '2025-11-05', '2025-11-15', 'InProgress'),
(1, 2, N'Dựng UI/UX', 1, N'Thiết kế giao diện cho 5 trang chính', '2025-11-10', '2025-11-20', 'Todo'),
(1, 3, N'Viết API đăng nhập', 2, N'API cho User (register, login, forgot pass)', '2025-11-15', '2025-11-25', 'Open'),
-- 2 Task cho Project 2 (ID=2)
(2, 1, N'Lên danh sách yêu cầu', 1, N'Gặp khách hàng lấy yêu cầu', '2025-06-01', '2025-06-10', 'Done'),
(2, 2, N'Nghiệm thu app', 2, N'Test và nghiệm thu cuối cùng', '2025-10-15', '2025-10-25', 'Close');
GO

-- 1.7. THÊM THÀNH VIÊN VÀO DỰ ÁN (PROJECT_MEMBER)
INSERT INTO PROJECT_MEMBER (UserID, PJ_ID, [Status])
VALUES
(2, 1, 'Working'),  -- PM Bình (ID 2) quản lý Project 1
(3, 2, 'Working'),  -- PM Cúc (ID 3) quản lý Project 2
(4, 1, 'Working'),  -- Participant Dũng (ID 4) tham gia Project 1
(5, 1, 'Interupting'), -- Participant Em (ID 5) tham gia Project 1 (đang ngắt quãng)
(4, 2, 'Stopping'); -- Participant Dũng (ID 4) ĐÃ tham gia Project 2 (đã dừng)
GO

-- 1.8. PHÂN CÔNG TASK (TASK_ASSIGN)
INSERT INTO TASK_ASSIGN (UserID, PJ_ID, TaskNo)
VALUES
(4, 1, 1), -- Gán Dũng (ID 4) làm Task (PJ_ID=1, No=1)
(5, 1, 2), -- Gán Em (ID 5) làm Task (PJ_ID=1, No=2)
(4, 1, 3); -- Gán Dũng (ID 4) làm Task (PJ_ID=1, No=3)
GO

-- 1.9. TẠO THÔNG BÁO (NOTIFICATION)
INSERT INTO [NOTIFICATION] (Content, ActionType, SenderID, ReceiverID, PJ_ID, TaskNo, Is_read)
VALUES
(N'Bạn vừa được thêm vào dự án "Xây dựng E-commerce"', N'PROJECT_INVITE', 1, 4, 1, NULL, 0), -- Gửi cho Dũng, về Project 1
(N'Bạn được gán task "Dựng UI/UX"', N'TASK_ASSIGNED', 2, 5, 1, 2, 0), -- Gửi cho Em, về Task (1,2)
(N'Task "Viết API đăng nhập" sắp đến hạn', N'TASK_DUE_SOON', NULL, 4, 1, 3, 1), -- Thông báo hệ thống (Sender NULL), gửi Dũng, về Task (1,3), đã đọc
(N'Hệ thống sẽ bảo trì vào 2h sáng', N'SYSTEM_ANNOUNCEMENT', 1, NULL, NULL, NULL, 0); -- Gửi cho MỌI NGƯỜI (Receiver NULL), không về PJ/Task
GO

-- 1.10. TẠO BÌNH LUẬN (COMMENT)
INSERT INTO COMMENT (Content, CreatorID, PJ_ID, TaskNo)
VALUES
(N'Database này cần thêm bảng Roles nhé.', 4, 1, 1), -- Dũng (ID 4) bình luận vào Task (1,1)
(N'Em đã upload file Figma lên drive nhé.', 5, 1, 2), -- Em (ID 5) bình luận vào Task (1,2)
(N'Nhắc mọi người 9h sáng mai họp team nhé.', 2, 1, NULL); -- PM Bình (ID 2) bình luận vào Project 1 (chung)
GO


-- ===== 2. DATA MẪU LẦN 2 (MỞ RỘNG) =====

-- 2.1. THÊM NGƯỜI DÙNG (USER) - Thêm 15 user mới
INSERT INTO [USER] (ID,FirstName, LastName, Email, [Password], PhoneNum, [Role], Status_System)
VALUES
(6, N'Giang', N'Hoàng', N'giang.pm@pm.com', N'pass123', '0911111111', 'PM', 'Active'),
(7, N'Hải', N'Lý', N'hai.dev@pm.com', N'pass123', '0911222222', 'Participant', 'Active'),
(8, N'Inh', N'Phạm', N'inh.dev@pm.com', N'pass123', '0911333333', 'Participant', 'Active'),
(9, N'Kiên', N'Đặng', N'kien.dev@pm.com', N'pass123', '0911444444', 'Participant', 'Active'),
(10, N'Linh', N'Bùi', N'linh.design@pm.com', N'pass123', '0911555555', 'Participant', 'Active'),
(11, N'Minh', N'Hồ', N'minh.pm@pm.com', N'pass123', '0911666666', 'PM', 'Active'),
(12, N'Nam', N'Vũ', N'nam.tester@pm.com', N'pass123', '0911777777', 'Participant', 'Active'),
(13, N'Oanh', N'Đỗ', N'oanh.tester@pm.com', N'pass123', '0911888888', 'Participant', 'Deactive'),
(14, N'Phúc', N'Ngô', N'phuc.dev@pm.com', N'pass123', '0911999999', 'Participant', 'Active'),
(15, N'Quân', N'Dương', N'quan.pm@pm.com', N'pass123', '0912111222', 'PM', 'Active'),
(16, N'Rừng', N'Trịnh', N'rung.dev@pm.com', N'pass123', '0912333444', 'Participant', 'Active'),
(17, N'Sơn', N'Phan', N'son.dev@pm.com', N'pass123', '0912555666', 'Participant', 'Active'),
(18, N'Trang', N'Lâm', N'trang.design@pm.com', N'pass123', '0912777888', 'Participant', 'Active'),
(19, N'Uyên', N'Châu', N'uyen.tester@pm.com', N'pass123', '0912999000', 'Participant', 'Active'),
(20, N'Vân', N'Tô', N'van.admin@pm.com', N'pass123', '0913111222', 'Admin', 'Active');
GO

-- 2.2. PHÂN VAI TRÒ: PROJECT MANAGER
INSERT INTO PROJECT_MANAGER (UserID, [EXP], Areas_Of_Expertise)
VALUES
(6, N'10 năm kinh nghiệm', N'Waterfall, Quản lý ngân sách'),
(11, N'4 năm kinh nghiệm', N'Scrum, Tối ưu hóa quy trình'),
(15, N'2 năm kinh nghiệm', N'Jira, Hỗ trợ team');
GO

-- 2.3. PHÂN VAI TRÒ: PARTICIPANT
INSERT INTO PARTICIPANT (UserID, BioURL, Professional_Skills)
VALUES
(7, 'github.com/hai-ly', N'Java, Spring Boot'),
(8, 'github.com/inh-pham', N'Python, Django, AI'),
(9, 'github.com/kien-dang', N'C#, .NET Core'),
(10, 'behance.net/linh-bui', N'Wireframing, Adobe XD'),
(12, 'github.com/nam-vu', N'Automation Test, Selenium'),
(13, 'github.com/oanh-do', N'Manual Test, Test Cases'),
(14, 'github.com/phuc-ngo', N'Vue.js, Nuxt.js'),
(16, 'github.com/rung-trinh', N'Angular, TypeScript'),
(17, 'github.com/son-phan', N'Database, SQL, NoSQL'),
(18, 'behance.net/trang-lam', N'Mobile Design, Illustrator'),
(19, 'github.com/uyen-chau', N'Performance Testing, JMeter');
GO

-- 2.4. THÊM BẰNG CẤP CHO PM
INSERT INTO DEGREES_AND_CERTIFICATES (PM_ID, Degree_or_Certificate)
VALUES
(2, N'PMP (Project Management Professional)'), -- Thêm cho PM cũ (ID 2)
(6, N'Thạc sỹ Quản trị Kinh doanh (MBA)'),
(6, N'PRINCE2 Practitioner'),
(11, N'Certified Agile Leader (CAL)'),
(15, N'Google Project Management Certificate');
GO

-- 2.5. TẠO DỰ ÁN (PROJECT)
INSERT INTO PROJECT (ID,[Name], [Description], StartDate, EndDate, [Status])
VALUES
(3, N'Hệ thống Quản lý Kho (WMS)', N'Phát triển WMS cho kho vận nội bộ', '2026-01-01', '2026-06-01', 'Open'),
(4, N'Website Tin tức AI', N'Trang web tự động tổng hợp tin tức bằng AI', '2026-02-01', '2026-08-01', 'Open'),
(5, N'CRM cho Doanh nghiệp', N'Hệ thống quản lý quan hệ khách hàng', '2026-03-01', '2026-12-01', 'Open'),
(6, N'Refactor hệ thống Legacy', N'Nâng cấp hệ thống E-commerce cũ', '2025-12-01', '2027-01-01', 'Open');
GO
-- 2.6. THÊM THÀNH VIÊN VÀO DỰ ÁN (PROJECT_MEMBER)
INSERT INTO PROJECT_MEMBER (UserID, PJ_ID, [Status])
VALUES
-- Phân công cho Project 1 (E-commerce)
(6, 1, 'Working'),  -- PM Giang (ID 6) vào Project 1
(7, 1, 'Working'),  -- Hải (ID 7) vào Project 1
(8, 1, 'Working'),  -- Inh (ID 8) vào Project 1
(18, 1, 'Working'), -- Trang (ID 18) vào Project 1
-- Phân công cho Project 3 (WMS)
(6, 3, 'Working'),  -- PM Giang (ID 6) quản lý Project 3
(9, 3, 'Working'),  -- Kiên (ID 9) vào Project 3
(17, 3, 'Working'), -- Sơn (ID 17) vào Project 3
(12, 3, 'Interupting'), -- Nam (ID 12) vào Project 3
-- Phân công cho Project 4 (AI News)
(11, 4, 'Working'), -- PM Minh (ID 11) quản lý Project 4
(8, 4, 'Working'),  -- Inh (ID 8) vào Project 4
(14, 4, 'Working'), -- Phúc (ID 14) vào Project 4
(16, 4, 'Working'), -- Rừng (ID 16) vào Project 4
-- Phân công cho Project 5 (CRM)
(11, 5, 'Working'), -- PM Minh (ID 11) quản lý Project 5
(4, 5, 'Working'),  -- Dũng (ID 4) vào Project 5
(7, 5, 'Working'),  -- Hải (ID 7) vào Project 5
(10, 5, 'Working'), -- Linh (ID 10) vào Project 5
(19, 5, 'Working'), -- Uyên (ID 19) vào Project 5
-- Phân công cho Project 6 (Refactor)
(2, 6, 'Working'),  -- PM Bình (ID 2) quản lý Project 6
(9, 6, 'Working'),  -- Kiên (ID 9) vào Project 6
(17, 6, 'Working'), -- Sơn (ID 17) vào Project 6
(12, 6, 'Stopping'); -- Nam (ID 12) vào Project 6
GO

-- 2.7. TẠO TASK CHO CÁC DỰ ÁN MỚI
INSERT INTO TASK (PJ_ID, [No], [Name], [Priority], [Description], StartDate, DueDate, [Status])
VALUES
-- Tasks cho Project 3 (WMS)
(3, 1, N'Phân tích yêu cầu Nhập kho', 1, N'Mô tả quy trình nhập hàng', '2026-01-05', '2026-01-15', 'Open'),
(3, 2, N'Thiết kế CSDL Kho', 1, N'Vẽ ERD cho WMS', '2026-01-10', '2026-01-20', 'Todo'),
(3, 3, N'Làm API Nhập kho', 2, N'API cho nghiệp vụ nhập kho', '2026-01-20', '2026-02-05', 'Todo'),
(3, 4, N'Test chức năng Nhập kho', 2, N'Viết test case và thực thi', '2026-02-05', '2026-02-15', 'Todo'),
-- Tasks cho Project 4 (AI News)
(4, 1, N'Nghiên cứu API AI', 1, N'Tìm hiểu các API tổng hợp tin (OpenAI, Gemini)', '2026-02-01', '2026-02-15', 'InProgress'),
(4, 2, N'Thiết kế Giao diện trang chủ', 1, N'UI/UX cho trang chủ', '2026-02-10', '2026-02-20', 'Todo'),
(4, 3, N'Xây dựng crawler lấy tin', 2, N'Crawler thu thập tin tức từ các nguồn', '2026-02-15', '2026-03-01', 'Todo'),
(4, 4, N'Tích hợp AI API', 2, N'Gọi API để tóm tắt và phân loại tin', '2026-03-01', '2026-03-15', 'Todo'),
-- Tasks cho Project 5 (CRM)
(5, 1, N'Thiết kế Module Khách hàng', 1, N'Quản lý thông tin khách hàng', '2026-03-05', '2026-03-20', 'Open'),
(5, 2, N'Thiết kế Module Cơ hội (Deal)', 1, N'Quản lý các cơ hội bán hàng', '2026-03-10', '2026-03-25', 'Todo'),
(5, 3, N'Làm API Khách hàng', 2, N'CRUD cho Khách hàng', '2026-03-20', '2026-04-10', 'Todo'),
(5, 4, N'Làm API Deals', 2, N'CRUD cho Deals', '2026-03-25', '2026-04-15', 'Todo'),
(5, 5, N'Test hiệu năng', 3, N'Test tải hệ thống với 1000 user', '2026-04-15', '2026-04-25', 'Todo'),
-- Tasks cho Project 6 (Refactor)
(6, 1, N'Phân tích CSDL cũ', 1, N'Audit toàn bộ CSDL hiện tại', '2025-12-01', '2025-12-15', 'InProgress'),
(6, 2, N'Nâng cấp .NET Core', 1, N'Nâng cấp API lên .NET 8', '2025-12-15', '2026-01-15', 'Open'),
(6, 3, N'Viết Unit Test', 2, N'Đảm bảo coverage > 80%', '2026-01-15', '2026-02-15', 'Todo');
GO

-- 2.8. PHÂN CÔNG TASK (TASK_ASSIGN)
INSERT INTO TASK_ASSIGN (UserID, PJ_ID, TaskNo)
VALUES
-- Phân công Project 3 (WMS)
(17, 3, 2), -- Sơn (ID 17) làm Task (3,2)
(9, 3, 3),  -- Kiên (ID 9) làm Task (3,3)
(12, 3, 4), -- Nam (ID 12) làm Task (3,4)
-- Phân công Project 4 (AI News)
(8, 4, 1),  -- Inh (ID 8) làm Task (4,1)
(14, 4, 2), -- Phúc (ID 14) làm Task (4,2)
(16, 4, 3), -- Rừng (ID 16) làm Task (4,3)
(8, 4, 4),  -- Inh (ID 8) làm Task (4,4)
-- Phân công Project 5 (CRM)
(10, 5, 1), -- Linh (ID 10) làm Task (5,1)
(10, 5, 2), -- Linh (ID 10) làm Task (5,2)
(4, 5, 3),  -- Dũng (ID 4) làm Task (5,3)
(7, 5, 4),  -- Hải (ID 7) làm Task (5,4)
(19, 5, 5), -- Uyên (ID 19) làm Task (5,5)
-- Phân công Project 6 (Refactor)
(17, 6, 1), -- Sơn (ID 17) làm Task (6,1)
(9, 6, 2),  -- Kiên (ID 9) làm Task (6,2)
(12, 6, 3), -- Nam (ID 12) làm Task (6,3)
(17, 6, 2); -- Sơn (ID 17) cũng làm Task (6,2)
GO

-- 2.9. TẠO THÔNG BÁO (NOTIFICATION)
INSERT INTO [NOTIFICATION] (Content, ActionType, SenderID, ReceiverID, PJ_ID, TaskNo, Is_read)
VALUES
(N'Bạn vừa được thêm vào dự án "Hệ thống Quản lý Kho (WMS)"', N'PROJECT_INVITE', 6, 9, 3, NULL, 0),
(N'Bạn vừa được thêm vào dự án "Hệ thống Quản lý Kho (WMS)"', N'PROJECT_INVITE', 6, 17, 3, NULL, 1),
(N'Bạn vừa được thêm vào dự án "Hệ thống Quản lý Kho (WMS)"', N'PROJECT_INVITE', 6, 12, 3, NULL, 0),
(N'Bạn được gán task "Nghiên cứu API AI"', N'TASK_ASSIGNED', 11, 8, 4, 1, 0),
(N'Bạn được gán task "Thiết kế Giao diện trang chủ"', N'TASK_ASSIGNED', 11, 14, 4, 2, 1),
(N'Bạn được gán task "Xây dựng crawler lấy tin"', N'TASK_ASSIGNED', 11, 16, 4, 3, 0),
(N'Task "Thiết kế Module Khách hàng" đã được tạo', N'TASK_UPDATED', 11, 4, 5, 1, 0), -- Gửi cho Dũng (ID 4) dù Dũng ko đc assign
(N'Task "Phân tích CSDL cũ" đã chuyển sang InProgress', N'TASK_STATUS_CHANGE', 17, 2, 6, 1, 0), -- Sơn (17) gửi PM Bình (2)
(N'Dự án "CRM cho Doanh nghiệp" đã được tạo', N'PROJECT_UPDATE', 1, 11, 5, NULL, 1), -- Admin (1) gửi PM Minh (11)
(N'Bạn đã bị xóa khỏi dự án "Refactor hệ thống Legacy"', N'PROJECT_KICK', 2, 12, 6, NULL, 0), -- PM Bình (2) gửi Nam (12)
(N'@dung.dev cần anh xem giúp API này', N'MENTION', 7, 4, 5, 3, 0), -- Hải (7) tag Dũng (4) trong Task (5,3)
(N'Task "Test hiệu năng" sắp đến hạn', N'TASK_DUE_SOON', NULL, 19, 5, 5, 0), -- Hệ thống gửi Uyên (19)
(N'Task "Viết Unit Test" đã bị quá hạn!', N'TASK_DUE_SOON', NULL, 12, 6, 3, 0), -- Hệ thống gửi Nam (12)
(N'Chúc mừng dự án "Phát triển Ứng dụng Mobile" đã hoàn thành!', N'PROJECT_STATUS_CHANGE', 1, NULL, 2, NULL, 0), -- Admin gửi all
(N'Vui lòng cập nhật timesheet cuối tuần', N'SYSTEM_ANNOUNCEMENT', 1, NULL, NULL, NULL, 0); -- Admin gửi all
GO

-- 2.10. TẠO BÌNH LUẬN (COMMENT)
INSERT INTO COMMENT (Content, CreatorID, PJ_ID, TaskNo)
VALUES
(N'Task này em làm chung với anh Kiên (ID 9) nhé', 17, 6, 2), -- Sơn (17) bình luận Task (6,2)
(N'OK em', 9, 6, 2), -- Kiên (9) trả lời
(N'Đã test xong, pass 100% test case', 12, 3, 4), -- Nam (12) bình luận Task (3,4)
(N'API này cần trả về thêm thông tin user nữa nhé', 6, 3, 3), -- PM Giang (6) bình luận Task (3,3)
(N'Em thấy dùng Gemini API có vẻ tối ưu chi phí hơn OpenAI', 8, 4, 1), -- Inh (8) bình luận Task (4,1)
(N'Anh duyệt giúp em bố cục trang chủ nhé', 14, 4, 2), -- Phúc (14) bình luận Task (4,2)
(N'Đã deploy lên server dev, mọi người vào test nhé', 16, 4, 3), -- Rừng (16) bình luận Task (4,3)
(N'Cần validate kỹ SĐT và Email', 10, 5, 1), -- Linh (10) bình luận Task (5,1)
(N'Module này liên kết với Bảng Khách hàng thế nào em?', 11, 5, 2), -- PM Minh (11) hỏi Task (5,2)
(N'Em đã push code lên GitLab, branch feature/crud-customer', 4, 5, 3), -- Dũng (4) bình luận Task (5,3)
(N'Đã chạy Jmeter, kết quả rất tệ, cần optimize query', 19, 5, 5), -- Uyên (19) bình luận Task (5,5)
(N'Dự án này sẽ áp dụng Scrum 2 tuần/sprint nhé', 11, 5, NULL), -- PM Minh (11) bình luận chung Project 5
(N'Tuần này tăng ca T7, mọi người cố gắng nhé', 2, 6, NULL), -- PM Bình (2) bình luận chung Project 6
(N'Mọi người ai có máy Mac M1 không, build code lỗi quá', 9, 6, 2), -- Kiên (9) bình luận Task (6,2)
(N'Dự án WMS sẽ kickoff vào T2 tuần tới', 6, 3, NULL); -- PM Giang (6) bình luận chung Project 3
GO
SELECT * FROM [USER]