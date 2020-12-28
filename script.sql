delimiter //
CREATE PROCEDURE initSession()
BEGIN
	SET @nameRegex = '^[^`!@#$%^&*()\'":;,/|0-9\[\]{}]{1,}$';
	SET @phoneNumRegex = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$';
	SET @usernameRegex = @usernameRegex;

	SET @nameMessage = 'Name is invalid.';
	SET @phoneNumMessage = 'Phone number invalid.';
	SET @birthdateMessage = 'The age of employee must be greater than 18.';
	SET @salaryMessage = 'Salary must be greater than 0.';
	SET @typeMessage = 'Type must be in (\'Labor\', \'Accountant\', \'Cashier\', \'Warehouse\', \'Driver\', \'Manager\', \'Seller\').';
	SET @usernameMessage = 'Username must includes at least 6 characters, accepts letter, digit, \'_\' and \'.\', and begin with a letter.';
	SET @pwMessage = 'Password must includes at least 6 characters.';
	SET @statusMessage = 'Status must be in (\'Pending\', \'Processing\', \'Completed\', \'Canceled\').';
	SET @oweMessage = 'Owe must not be negative.';
	SET @oweLimitMessage = 'OweLimit must not be negative.';
	SET @exceedOweLimitMessage = 'Owe exceeding the owe limit.';
	SET @orderCanceledMessage = 'This order was canceled';
	SET @orderCompletedMessage = 'This order was completed';
END;//

CREATE TABLE IF NOT EXISTS CUSTOMER (
	id			INT NOT NULL AUTO_INCREMENT,
    name 		VARCHAR(32) NOT NULL,
    gender		BOOL,
    address		VARCHAR(64) NOT NULL,
    phoneNum	VARCHAR(15) NOT NULL,
    birthdate	DATE NOT NULL,
    owe			BIGINT,
    oweLimit	BIGINT,
    groupName	VARCHAR(32) DEFAULT 'Default',
    username	VARCHAR(32) UNIQUE,
    pw			VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE CUSTOMER AUTO_INCREMENT = 100000;

CREATE TABLE IF NOT EXISTS `GROUP` (
	name		VARCHAR(32) NOT NULL,
    oweLimit	BIGINT NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS EMPLOYEE (
	id			INT NOT NULL AUTO_INCREMENT,
    name 		VARCHAR(32) NOT NULL,
    gender		BOOL,
    address		VARCHAR(64) NOT NULL,
    phoneNum	VARCHAR(15) NOT NULL,
    birthdate	DATE NOT NULL,
    salary		BIGINT NOT NULL,
    type		VARCHAR(15) NOT NULL,
    username	VARCHAR(32) UNIQUE,
    pw			VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE EMPLOYEE AUTO_INCREMENT = 100000;

CREATE TABLE IF NOT EXISTS LABOR (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS ACCOUNTANT (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS CASHIER (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS WAREHOUSE (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS DRIVER (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS MANAGER (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS SELLER (
	id			INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `ORDER` (
	id			INT NOT NULL AUTO_INCREMENT,
    createDate	DATE NOT NULL,
    status		VARCHAR(10) NOT NULL,
    note		VARCHAR(64),
    address		VARCHAR(64) NOT NULL,
    cusId		INT NOT NULL,
    sellId		INT,
    PRIMARY KEY (id)
);
-- ALTER TABLE `ORDER` MODIFY createDate DATETIME NOT NULL;


CREATE TABLE IF NOT EXISTS PRODUCT (
	id			INT NOT NULL AUTO_INCREMENT,
    name 		VARCHAR(32) NOT NULL,
    description	VARCHAR(32),
    color		VARCHAR(16) NOT NULL,
    image		VARCHAR(16) NOT NULL,
    type		VARCHAR(16) NOT NULL,
    form		VARCHAR(16) NOT NULL,
    supplier	VARCHAR(32) NOT NULL,
    quantity	DECIMAL(10, 2) NOT NULL,
    unit		VARCHAR(10),
    unitPrice	BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS INCLUDE (
	orderId		INT NOT NULL,
    productId	INT NOT NULL,
    quantity	DECIMAL(10, 2),
    unitPrice	BIGINT NOT NULL,
    PRIMARY KEY (orderId, productId)
);

CREATE TABLE IF NOT EXISTS SHIPMENT (
	id			INT NOT NULL AUTO_INCREMENT,
    status		VARCHAR(32) NOT NULL,
    position	VARCHAR(64) NOT NULL,
    warehouseId	INT NOT NULL,
    shipDeptId	INT NOT NULL,
    time		DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS SHIP (
	orderId		INT NOT NULL,
    productId	INT NOT NULL,
    shipmentId	INT NOT NULL,
    quantity	DECIMAL(10, 2) NOT NULL,
    -- unit ??
   --  time		DATETIME NOT NULL,
--     weight		DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (orderId, productId, shipmentId)
);

CREATE TABLE IF NOT EXISTS RELEASEMENT (
	id			INT NOT NULL AUTO_INCREMENT,
    orderId		INT NOT NULL,
    time		DATETIME NOT NULL,
    sellId		INT NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS `RELEASE`;
CREATE TABLE IF NOT EXISTS `RELEASE` (
	productId	INT NOT NULL,
    releaseId	INT NOT NULL,
    quantity	DECIMAL(10, 2) NOT NULL,
    -- unitPrice	BIGINT,
    -- vat			BIGINT,
    PRIMARY KEY (productId, releaseId)
);

CREATE TABLE IF NOT EXISTS RECEIPT (
	id			INT NOT NULL AUTO_INCREMENT,
    amount		BIGINT NOT NULL,
    time		DATETIME NOT NULL,
    cusId		INT NOT NULL,
    cashierId	INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS PAYMENT (
	id			INT  NOT NULL AUTO_INCREMENT,
    amount		BIGINT NOT NULL,
    time		DATETIME NOT NULL,
    goal		VARCHAR(64),
    cashierId	INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS SHIP_DEPARTMENT (
	id			INT NOT NULL AUTO_INCREMENT,
    type		VARCHAR(10),
    username	VARCHAR(32) UNIQUE,
    pw			VARCHAR(60) NOT NULL,
    PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS INTERNAL_SHIP (
	id			INT NOT NULL,
    driverId	INT NOT NULL,
    vehicle		VARCHAR(16),
    license		VARCHAR(16),
    PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS EXTERNAL_SHIP (
	id			INT NOT NULL,
    driverName	VARCHAR(32) NOT NULL,
    vehicle		VARCHAR(16),
    PRIMARY KEY(id)
);

ALTER TABLE customer ADD CONSTRAINT FK_customer_group FOREIGN KEY(groupName) REFERENCES `GROUP`(name)
	ON DELETE SET DEFAULT
    ON UPDATE CASCADE;
    
ALTER TABLE employee ADD CONSTRAINT CHK_employee_salary CHECK (salary > 0);

ALTER TABLE labor ADD CONSTRAINT FK_labor_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE accountant ADD CONSTRAINT FK_accountant_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE cashier ADD CONSTRAINT FK_cashier_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE warehouse ADD CONSTRAINT FK_warehouse_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE driver ADD CONSTRAINT FK_driver_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE manager ADD CONSTRAINT FK_manager_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;
ALTER TABLE seller ADD CONSTRAINT FK_seller_employee FOREIGN KEY(id) REFERENCES EMPLOYEE(id)
	ON DELETE CASCADE;

ALTER TABLE `ORDER` ADD CONSTRAINT FK_order_customer FOREIGN KEY(cusId) REFERENCES CUSTOMER(id);
ALTER TABLE `ORDER` ADD CONSTRAINT FK_order_seller FOREIGN KEY(sellId) REFERENCES SELLER(id);
ALTER TABLE INCLUDE ADD CONSTRAINT FK_include_order FOREIGN KEY(orderId) REFERENCES `ORDER`(id);
ALTER TABLE INCLUDE ADD CONSTRAINT FK_include_product FOREIGN KEY(productId) REFERENCES PRODUCT(id);
ALTER TABLE SHIPMENT ADD CONSTRAINT FK_shipment_warehouse FOREIGN KEY(warehouseId) REFERENCES WAREHOUSE(id);
ALTER TABLE SHIPMENT ADD CONSTRAINT FK_shipment_ship_department FOREIGN KEY(shipDeptId) REFERENCES SHIP_DEPARTMENT(id);
ALTER TABLE SHIP ADD CONSTRAINT FK_ship_order FOREIGN KEY(orderId) REFERENCES `ORDER`(id);
ALTER TABLE SHIP ADD CONSTRAINT FK_ship_product FOREIGN KEY(productId) REFERENCES PRODUCT(id);
ALTER TABLE SHIP ADD CONSTRAINT FK_ship_shipment FOREIGN KEY(shipmentId) REFERENCES SHIPMENT(id);
ALTER TABLE RELEASEMENT ADD CONSTRAINT FK_releasement_order FOREIGN KEY(orderId) REFERENCES `ORDER`(id)
	ON DELETE CASCADE;
ALTER TABLE RELEASEMENT ADD CONSTRAINT FK_releasement_seller FOREIGN KEY(sellId) REFERENCES SELLER(id);
ALTER TABLE `RELEASE` ADD CONSTRAINT FK_release_product FOREIGN KEY(productId) REFERENCES PRODUCT(id);
ALTER TABLE `RELEASE` ADD CONSTRAINT FK_release_releasement FOREIGN KEY(releaseId) REFERENCES RELEASEMENT(id);
ALTER TABLE RECEIPT ADD CONSTRAINT FK_receipt_customer FOREIGN KEY(cusId) REFERENCES CUSTOMER(id);
ALTER TABLE RECEIPT ADD CONSTRAINT FK_receipt_cashier FOREIGN KEY(cashierId) REFERENCES CASHIER(id);
ALTER TABLE PAYMENT ADD CONSTRAINT FK_payment_cashier FOREIGN KEY(cashierId) REFERENCES CASHIER(id);
ALTER TABLE INTERNAL_SHIP ADD CONSTRAINT FK_internal_ship_ship_department FOREIGN KEY(id) REFERENCES SHIP_DEPARTMENT(id);
ALTER TABLE INTERNAL_SHIP ADD CONSTRAINT FK_internal_ship_driver FOREIGN KEY(driverId) REFERENCES DRIVER(id);
ALTER TABLE EXTERNAL_SHIP ADD CONSTRAINT FK_external_ship_ship_department FOREIGN KEY(id) REFERENCES SHIP_DEPARTMENT(id);

delimiter //
CREATE TRIGGER TR_employee_beforeinsert BEFORE INSERT ON EMPLOYEE
FOR EACH ROW
BEGIN
	IF NOT REGEXP_LIKE(NEW.name, @nameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @nameMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.phoneNum, @phoneNumRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @phoneNumMessage;
	END IF;
    IF DATE_SUB(CURRENT_DATE(), INTERVAL 18 YEAR) < NEW.birthdate THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @birthdateMessage;
    END IF;
	IF NEW.salary <= 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @salaryMessage;
    END IF;
    IF NEW.type NOT IN ('Labor', 'Accountant', 'Cashier', 'Warehouse', 'Driver', 'Manager', 'Seller') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @typeMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//


delimiter //
CREATE TRIGGER TR_employee_beforeupdate BEFORE UPDATE ON EMPLOYEE
FOR EACH ROW
BEGIN
	IF NOT REGEXP_LIKE(NEW.name, @nameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @nameMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.phoneNum, @phoneNumRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @phoneNumMessage;
	END IF;
    IF DATE_SUB(CURRENT_DATE(), INTERVAL 18 YEAR) < NEW.birthdate THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @birthdateMessage;
    END IF;
	IF NEW.salary <= 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @salaryMessage;
    END IF;
    IF NEW.type NOT IN ('Labor', 'Accountant', 'Cashier', 'Warehouse', 'Driver', 'Manager', 'Seller') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @typeMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//

delimiter //
CREATE TRIGGER TR_order_beforeinsert BEFORE INSERT ON `ORDER`
FOR EACH ROW
BEGIN
	IF NEW.status NOT IN ('Pending', 'Processing', 'Completed', 'Canceled') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @statusMessage;
	END IF;
END;//

delimiter //
CREATE TRIGGER TR_order_beforeupdate BEFORE UPDATE ON `ORDER`
FOR EACH ROW
BEGIN
	IF NEW.status NOT IN ('Pending', 'Processing', 'Completed', 'Canceled') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @statusMessage;
	END IF;
END;//

delimiter //
CREATE TRIGGER TR_ship_department_beforeinsert BEFORE INSERT ON SHIP_DEPARTMENT
FOR EACH ROW
BEGIN
	IF NEW.type NOT IN ('Internal', 'External') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Type must be in (\'Internal\', \'External\').';
	END IF;
	IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//

delimiter //
CREATE TRIGGER TR_ship_department_beforeupdate BEFORE UPDATE ON SHIP_DEPARTMENT
FOR EACH ROW
BEGIN
	IF NEW.type NOT IN ('Internal', 'External') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Type must be in (\'Internal\', \'External\').';
	END IF;
	IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//

delimiter //
CREATE TRIGGER TR_employee_afterinsert AFTER INSERT ON EMPLOYEE
FOR EACH ROW
BEGIN
	IF NEW.type = 'Labor' THEN
		INSERT INTO labor VALUES(NEW.id);
    ELSEIF NEW.type = 'Accountant' THEN
		INSERT INTO accountant VALUES(NEW.id);
    ELSEIF NEW.type = 'Cashier' THEN
		INSERT INTO cashier VALUES(NEW.id);
    ELSEIF NEW.type = 'Warehouse' THEN
		INSERT INTO warehouse VALUES(NEW.id);
    ELSEIF NEW.type = 'Driver' THEN
		INSERT INTO driver VALUES(NEW.id);
    ELSEIF NEW.type = 'Manager' THEN
		INSERT INTO manager VALUES(NEW.id);
    ELSEIF NEW.type = 'Seller' THEN
		INSERT INTO seller VALUES(NEW.id);
    END IF;
END;//

delimiter //
CREATE TRIGGER TR_employee_afterupdate AFTER UPDATE ON EMPLOYEE
FOR EACH ROW
BEGIN
	IF NEW.type != OLD.type THEN
		IF NEW.type = 'Labor' THEN
			INSERT INTO labor VALUES(NEW.id);
		ELSEIF NEW.type = 'Accountant' THEN
			INSERT INTO accountant VALUES(NEW.id);
		ELSEIF NEW.type = 'Cashier' THEN
			INSERT INTO cashier VALUES(NEW.id);
		ELSEIF NEW.type = 'Warehouse' THEN
			INSERT INTO warehouse VALUES(NEW.id);
		ELSEIF NEW.type = 'Driver' THEN
			INSERT INTO driver VALUES(NEW.id);
		ELSEIF NEW.type = 'Manager' THEN
			INSERT INTO manager VALUES(NEW.id);
		ELSEIF NEW.type = 'Seller' THEN
			INSERT INTO seller VALUES(NEW.id);
		END IF;
        
        IF OLD.type = 'Labor' THEN
			DELETE FROM labor WHERE id = NEW.id;
		ELSEIF OLD.type = 'Accountant' THEN
			DELETE FROM accountant WHERE id = NEW.id;
		ELSEIF OLD.type = 'Cashier' THEN
			DELETE FROM cashier WHERE id = NEW.id;
		ELSEIF OLD.type = 'Warehouse' THEN
			DELETE FROM warehouse WHERE id = NEW.id;
		ELSEIF OLD.type = 'Driver' THEN
			DELETE FROM driver WHERE id = NEW.id;
		ELSEIF OLD.type = 'Manager' THEN
			DELETE FROM manager WHERE id = NEW.id;
		ELSEIF OLD.type = 'Seller' THEN
			DELETE FROM seller WHERE id = NEW.id;
		END IF;
	END IF;
END;//

-- DROP TRIGGER TR_internal_ship_beforeinsert;
-- delimiter //
-- CREATE TRIGGER TR_internal_ship_beforeinsert BEFORE INSERT ON INTERNAL_SHIP
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO SHIP_DEPARTMENT VALUES(null, 'Internal', NEW.username, NEW.pw);
--     SELECT MAX(id) FROM SHIP_DEPARTMENT LIMIT 1 INTO @newId;
--     SET NEW.id = @newId;
-- END;//

-- DROP TRIGGER TR_external_ship_beforeinsert;
-- delimiter //
-- CREATE TRIGGER TR_external_ship_beforeinsert BEFORE INSERT ON EXTERNAL_SHIP
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO SHIP_DEPARTMENT VALUES(null, 'External', NEW.username, NEW.pw);
--     SELECT MAX(id) FROM SHIP_DEPARTMENT LIMIT 1 INTO @newId;
--     SET NEW.id = @newId;
-- END;//

DROP TRIGGER IF EXISTS TR_customer_beforeinsert;
delimiter //
CREATE TRIGGER TR_customer_beforeinsert BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
	IF NOT REGEXP_LIKE(NEW.name, @nameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @nameMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.phoneNum, @phoneNumRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @phoneNumMessage;
	END IF;
    IF NEW.owe IS NOT NULL AND NEW.owe < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @oweMessage;
	END IF;
    IF NEW.oweLimit IS NOT NULL AND NEW.oweLimit < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @oweLimitMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//

DROP TRIGGER IF EXISTS TR_customer_beforeupdate;
delimiter //
CREATE TRIGGER TR_customer_beforeupdate BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
	IF NOT REGEXP_LIKE(NEW.name, @nameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @nameMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.phoneNum, @phoneNumRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @phoneNumMessage;
	END IF;
    IF NEW.owe IS NOT NULL AND NEW.owe < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @oweMessage;
	END IF;
    IF NEW.oweLimit IS NOT NULL AND NEW.oweLimit < 0 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @oweLimitMessage;
	END IF;
    IF NOT REGEXP_LIKE(NEW.username, @usernameRegex) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @usernameMessage;
    END IF;    
    IF LENGTH(NEW.pw) < 6 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @pwMessage;
    END IF;
END;//

DROP PROCEDURE IF EXISTS usp_customer_insert;
delimiter //
CREATE PROCEDURE usp_customer_insert(
	IN	name		VARCHAR(32),
    IN	gender		BOOL,
    IN	address		VARCHAR(64),
    IN	phoneNum	VARCHAR(15),
    IN	birthdate	DATE,
    IN	owe			BIGINT,
    IN	oweLimit	BIGINT,
    IN	groupName	VARCHAR(32),
    IN	username	VARCHAR(32),
    IN	pw			VARCHAR(60)
)
BEGIN
	IF groupName IS NULL THEN
		SET groupName = 'Default';
	END IF;
	INSERT INTO CUSTOMER VALUES(null, name, gender, address, phoneNum, birthdate, owe, oweLimit, groupName, username, pw);
END;//





DROP FUNCTION IF EXISTS insertProductAndGetId;
delimiter //
CREATE FUNCTION insertProductAndGetId (
	name 		VARCHAR(32),
    description	VARCHAR(32),
    color		VARCHAR(16),
    image		VARCHAR(16),
    type		VARCHAR(16),
    form		VARCHAR(16),
    supplier	VARCHAR(32),
    quantity	DECIMAL(10, 2),
    unit		VARCHAR(10),
    unitPrice	BIGINT
)
RETURNS INT DETERMINISTIC
BEGIN
	INSERT INTO PRODUCT VALUES(null, name, description, color, image, type, form, supplier, quantity, unit, unitPrice);
    SELECT MAX(id) FROM PRODUCT LIMIT 1 INTO @newId;
    RETURN @newId;
END;//
SELECT insertProductAndGetId(null,null,null,null,null,null,null,null,null,null);

DROP FUNCTION IF EXISTS updateProductAndGetImage;
delimiter //
CREATE FUNCTION updateProductAndGetImage (
	_id				INT,
	_name	 		VARCHAR(32),
    _description	VARCHAR(32),
    _color			VARCHAR(16),
    _image			VARCHAR(16),
    _type			VARCHAR(16),
    _form			VARCHAR(16),
    _supplier		VARCHAR(32),
    _quantity		DECIMAL(10, 2),
    _unit			VARCHAR(10),
    _unitPrice		BIGINT
)
RETURNS VARCHAR(16) DETERMINISTIC
BEGIN
	SELECT image FROM PRODUCT WHERE id = _id INTO @oldImage;
    UPDATE PRODUCT SET name=_name, description=_description, color=_color, type=_type, form=_form, supplier=_supplier, quantity=_quantity, unit=_unit, unitPrice=_unitPrice WHERE id = _id;
    IF _image IS NOT NULL THEN
		UPDATE PRODUCT SET image=_image WHERE id = _id;
    END IF;
    RETURN @oldImage;
END;//
-- SELECT insertProductAndGetId(null,null,null,null,null,null,null,null,null,null);

DROP FUNCTION IF EXISTS insertOrderAndGetId;
delimiter //
CREATE FUNCTION insertOrderAndGetId (
    _note		VARCHAR(64),
    _address	VARCHAR(64),
    _cusId		INT,
    _sellId		INT
)
RETURNS INT DETERMINISTIC
BEGIN
	SELECT C.owe >= COALESCE(C.oweLimit, G.oweLimit) 
    FROM CUSTOMER AS C INNER JOIN `GROUP` AS G ON C.groupName=G.name
    WHERE C.id=_cusId LIMIT 1 INTO @exceedOweLimit;
    
    IF @exceedOweLimit THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @exceedOweLimitMessage;
    END IF;
    
    INSERT INTO `ORDER` VALUES(null, CURRENT_TIME(), 'Pending', _note, _address, _cusId, _sellId);
    SELECT MAX(id) FROM `ORDER` LIMIT 1 INTO @newId;
    RETURN @newId;
END;//

DROP PROCEDURE IF EXISTS insertInclude;
delimiter //
CREATE PROCEDURE insertInclude (
    orderId		INT,
    productId	INT,
    quantity	DECIMAL(10, 2)
)
BEGIN
	SELECT unitPrice FROM PRODUCT WHERE id = productId LIMIT 1 INTO @unitPrice;
    INSERT INTO INCLUDE VALUES(orderId, productId, quantity, @unitPrice);
END;//

DROP PROCEDURE IF EXISTS getDetailOfOrder;
delimiter //
CREATE PROCEDURE getDetailOfOrder (
    orderId		INT
)
BEGIN
	SELECT O.id as orderId, createDate, status, note, O.address as orderAddress, cusId, sellId, cusId, name, gender, C.address AS cusAddress, phoneNum, birthdate, owe, oweLimit, groupName
	FROM `ORDER` AS O, CUSTOMER AS C WHERE O.cusId = C.id;
END;//

DROP PROCEDURE IF EXISTS getReleasedOfOrder;
delimiter //
CREATE PROCEDURE getReleasedOfOrder (
    _orderId		INT
)
BEGIN
	SELECT P.id, P.name, P.quantity, P.unit, I.quantity ordered_quantity, IFNULL(SUM(RL.quantity), 0) AS released_quantity
	FROM PRODUCT as P INNER JOIN `INCLUDE` as I ON P.id = I.productId
	INNER JOIN `ORDER` AS O ON O.id = I.orderId
	LEFT OUTER JOIN RELEASEMENT as RLM ON RLM.orderId = O.id
	LEFT OUTER JOIN `RELEASE` as RL ON RL.releaseId = RLM.id AND P.id=RL.productId
    WHERE O.id = _orderId
	GROUP BY P.id;
END;//

DROP FUNCTION IF EXISTS insertReleasementAndGetId;
delimiter //
CREATE FUNCTION insertReleasementAndGetId (
    _orderId	INT,
    _sellId		INT
)
RETURNS INT DETERMINISTIC
BEGIN
	SELECT status FROM `ORDER` WHERE id=_orderId LIMIT 1 INTO @status;
    IF @status = 'Canceled' THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @orderCanceledMessage;
    END IF;
    IF @status = 'Completed' THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @orderCompletedMessage;
    END IF;
    
	INSERT INTO RELEASEMENT VALUES(null, _orderId, CURRENT_TIME(), _sellId);
    SELECT MAX(id) FROM RELEASEMENT LIMIT 1 INTO @newId;
    RETURN @newId;
END;//

DROP PROCEDURE IF EXISTS insertReleaseAndAddOwe;
delimiter //
CREATE PROCEDURE insertReleaseAndAddOwe (
    _productId	INT,
    _releaseId	INT,
    _quantity	DECIMAL(10, 2)
)
BEGIN
	INSERT INTO `RELEASE` VALUES(_productId, _releaseId, _quantity);
    
    SELECT O.cusId, _quantity * I.unitPrice
    FROM RELEASEMENT AS RLM INNER JOIN `ORDER` AS O ON RLM.orderId=O.id 
    INNER JOIN INCLUDE AS I ON O.id=I.orderId
    WHERE I.productId=_productId
    LIMIT 1
    INTO @cusId, @price;
	
    UPDATE CUSTOMER SET owe = owe + @price WHERE id = @cusId;
    UPDATE PRODUCT SET quantity = quantity - _quantity WHERE id = _productId;
END;//

DROP PROCEDURE IF EXISTS getAllUnships;
delimiter //
CREATE PROCEDURE getAllUnships ()
BEGIN
	SELECT TB1.orderId, TB1.address, TB1.productId, TB1.name, TB1.unit, TB1.released_quantity, IFNULL(TB2.shipped_quantity, 0) AS shipped_quantity FROM
    (
		SELECT RLM.orderId, O.address, RL.productId, P.name, P.unit, SUM(RL.quantity) AS released_quantity
		FROM `RELEASE` AS RL INNER JOIN RELEASEMENT AS RLM ON RL.releaseId = RLM.id
		INNER JOIN `ORDER` AS O ON RLM.orderId=O.id
		INNER JOIN PRODUCT AS P ON RL.productId=P.id
		GROUP BY RLM.orderId, RL.productId
    ) AS TB1
    LEFT OUTER JOIN 
    (
		SELECT S.orderId, productId, SUM(S.quantity) as shipped_quantity FROM SHIP AS S
		GROUP BY S.orderId, S.productId
    ) AS TB2
    ON TB1.orderId=TB2.orderId AND TB1.productId=TB2.productId
    WHERE TB1.released_quantity != IFNULL(TB2.shipped_quantity, 0);
END;//

DROP FUNCTION IF EXISTS insertShipmentAndGetId;
delimiter //
CREATE FUNCTION insertShipmentAndGetId (
    _whid	INT,
    _sdid	INT
)
RETURNS INT DETERMINISTIC
BEGIN
	INSERT INTO SHIPMENT VALUES(null, 'Preparing', 'Warehouse', _whid, _sdid, CURRENT_TIME());
    SELECT MAX(id) FROM SHIPMENT LIMIT 1 INTO @newId;
    RETURN @newId;
END;//

DROP PROCEDURE IF EXISTS getDetailsOfShipment;
delimiter //
CREATE PROCEDURE getDetailsOfShipment (
	_shipmentId		INT
)
BEGIN
	SELECT S.orderId, S.productId, P.name, P.unit, S.quantity, C.name AS cusName, O.address 
	FROM SHIP AS S INNER JOIN `ORDER` AS O ON S.orderId=O.id
	INNER JOIN CUSTOMER AS C ON O.cusId = C.id
	INNER JOIN PRODUCT AS P ON S.productId=P.id
	WHERE S.shipmentId = _shipmentId;
END;//

delimiter //
CREATE PROCEDURE insertInternalShip (
	_driverId	INT,
    _vehicle	VARCHAR(16),
    _license	VARCHAR(16),
	_username	VARCHAR(32),
	_pw			VARCHAR(60)
)
BEGIN
	INSERT INTO SHIP_DEPARTMENT VALUES(null, 'Internal', _username, _pw);
    SELECT MAX(id) FROM SHIP_DEPARTMENT LIMIT 1 INTO @newId;
    INSERT INTO INTERNAL_SHIP VALUES(@newId, _driverId, _vehicle, _license);    
END;//

delimiter //
CREATE PROCEDURE insertExternalShip (
	_driverName	INT,
    _vehicle	VARCHAR(16),
	_username	VARCHAR(32),
	_pw			VARCHAR(60)
)
BEGIN
	INSERT INTO SHIP_DEPARTMENT VALUES(null, 'External', _username, _pw);
    SELECT MAX(id) FROM SHIP_DEPARTMENT LIMIT 1 INTO @newId;
    INSERT INTO INTERNAL_SHIP VALUES(@newId, _driverName, _vehicle);    
END;//

-- DROP PROCEDURE IF EXISTS usp_customer_update;
-- delimiter //
-- CREATE PROCEDURE usp_customer_update(
-- 	IN 	_id			INT,
-- 	IN	_name		VARCHAR(32),
--     IN	_address	VARCHAR(64),
--     IN	_phoneNum	VARCHAR(15),
--     IN	_birthdate	DATE
-- )
-- BEGIN
-- 	UPDATE CUSTOMER
-- 		SET name = _name, address = _address, phoneNum = _phoneNum, birthdate = _birthdate
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_customer_updateOwe;
-- delimiter //
-- CREATE PROCEDURE usp_customer_updateOwe(
-- 	IN 	_id			INT,
-- 	IN	_owe		BIGINT
-- )
-- BEGIN
-- 	UPDATE CUSTOMER
-- 		SET owe = _owe
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_customer_updateOweLimitAndGroup;
-- delimiter //
-- CREATE PROCEDURE usp_customer_updateOweLimitAndGroup(
-- 	IN 	_id			INT,
-- 	IN	_oweLimit	BIGINT,
--     IN	_groupName	VARCHAR(32)
-- )
-- BEGIN
-- 	UPDATE CUSTOMER
-- 		SET oweLimit = _oweLimit, groupName = _groupName
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_customer_updatePw;
-- delimiter //
-- CREATE PROCEDURE usp_customer_updatePw(
-- 	IN 	_id			INT,
-- 	IN	_pw			VARCHAR(60)
-- )
-- BEGIN
-- 	UPDATE CUSTOMER
-- 		SET pw = _pw
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_group_insert;
-- delimiter //
-- CREATE PROCEDURE usp_group_insert(
-- 	IN	name		VARCHAR(32),
--     IN	oweLimit	BIGINT
-- )
-- BEGIN
-- 	INSERT INTO `GROUP` VALUES(name, oweLimit);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_group_update;
-- delimiter //
-- CREATE PROCEDURE usp_group_update(
-- 	IN	_name		VARCHAR(32),
--     IN	_oweLimit	BIGINT
-- )
-- BEGIN
-- 	UPDATE `GROUP`
-- 		SET name = _name, oweLimit = _oweLimit
--     WHERE name = _name;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_employee_insert;
-- delimiter //
-- CREATE PROCEDURE usp_employee_insert(
-- 	name 		VARCHAR(32),
--     gender		BOOL,
--     address		VARCHAR(64),
--     phoneNum	VARCHAR(15),
--     birthdate	DATE,
--     salary		BIGINT,
--     type		VARCHAR(15),
--     username	VARCHAR(32),
--     pw			VARCHAR(6)
-- )
-- BEGIN
-- 	INSERT INTO EMPLOYEE VALUES(null, name, gender, address, phoneNum, birthdate, salary, type, username, pw);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_employee_updateInfo;
-- delimiter //
-- CREATE PROCEDURE usp_employee_updateInfo(
-- 	_id			INT,
-- 	_name 		VARCHAR(32),
--     _address	VARCHAR(64),
--     _phoneNum	VARCHAR(15),
--     _birthdate	DATE
-- )
-- BEGIN
-- 	UPDATE EMPLOYEE
-- 		SET name = _name, address = _address, phoneNum = _phoneNum, birthdate = _birthdate
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_employee_updateSalaryAndType;
-- delimiter //
-- CREATE PROCEDURE usp_employee_updateSalaryAndType(
-- 	_id			INT,
-- 	_salary		BIGINT,
--     _type		VARCHAR(15)
-- )
-- BEGIN
-- 	UPDATE EMPLOYEE
-- 		SET salary = _salary, type = _type
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_employee_updatePw;
-- delimiter //
-- CREATE PROCEDURE usp_employee_updatePw(
-- 	IN 	_id			INT,
-- 	IN	_pw			VARCHAR(60)
-- )
-- BEGIN
-- 	UPDATE EMPLOYEE
-- 		SET pw = _pw
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_order_insert;
-- delimiter //
-- CREATE PROCEDURE usp_order_insert(
--     IN	_createDate	DATE,
--     IN	_status		VARCHAR(10),
--     IN	_note		VARCHAR(64),
--     IN	_address	VARCHAR(64),
--     IN	_cusId		INT,
--     IN	_sellId		INT
-- )
-- BEGIN
-- 	IF _createDate IS NULL THEN
-- 		SET _createDate = CURRENT_DATE();
-- 	END IF;
--     IF _status IS NULL THEN
-- 		SET _status = 'Pending';
-- 	END IF;
-- 	INSERT INTO `ORDER` VALUES(null, _createDate, _status, _note, _address, _cusId, _sellId);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_order_updateStatus;
-- delimiter //
-- CREATE PROCEDURE usp_order_updateStatus(
--     IN	_id			INT,
--     IN	_status		VARCHAR(10)
-- )
-- BEGIN
-- 	UPDATE `ORDER`
-- 		SET status = _status
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_product_insert;
-- delimiter //
-- CREATE PROCEDURE usp_product_insert(
--     IN	name	 		VARCHAR(32),
--     IN	description		VARCHAR(32),
--     IN	color			VARCHAR(16),
--     IN	image			VARCHAR(16),
--     IN	type			VARCHAR(16),
--     IN	form			VARCHAR(16),
--     IN	supplier		VARCHAR(32),
--     IN	quantity		DECIMAL(10, 2),
--     IN	unit			VARCHAR(10)
-- )
-- BEGIN
-- 	INSERT INTO PRODUCT VALUES(null, name, description, color, image, type, form, supplier, quantity, unit);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_product_update;
-- delimiter //
-- CREATE PROCEDURE usp_product_update(
-- 	IN	_id				INT,
--     IN	_name	 		VARCHAR(32),
--     IN	_description	VARCHAR(32),
--     IN	_color			VARCHAR(16),
--     IN	_image			VARCHAR(16),
--     IN	_type			VARCHAR(16),
--     IN	_form			VARCHAR(16),
--     IN	_supplier		VARCHAR(32),
--     IN	_quantity		DECIMAL(10, 2),
--     IN	_unit			VARCHAR(10)
-- )
-- BEGIN
-- 	UPDATE PRODUCT
-- 		SET name = _name, description = _description, color = _color, image = _image, type = _type, form = form, supplier = _supplier, quantity = _quantity, unit = _unit
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_include_insert;
-- delimiter //
-- CREATE PROCEDURE usp_include_insert(
--     IN	orderId		INT,
--     IN	productId	INT,
--     IN	quantity	DECIMAL(10, 2)
-- )
-- BEGIN
-- 	INSERT INTO INCLUDE VALUES(orderId, productId, quantity);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_shipment_insert;
-- delimiter //
-- CREATE PROCEDURE usp_shipment_insert(
--     IN	status		VARCHAR(32),
--     IN	position	VARCHAR(64),
--     IN	warehouseId	INT,
--     In	shipDeptId	INT
-- )
-- BEGIN
-- 	INSERT INTO SHIPMENT VALUES(null, status, position, warehouseId, shipDeptId);
-- END;//

-- DROP PROCEDURE IF EXISTS usp_shipment_updateStatusAndPosition;
-- delimiter //
-- CREATE PROCEDURE usp_shipment_updateStatusAndPosition(
-- 	IN	_id			INT,
--     IN	_status		VARCHAR(32),
--     IN	_position	VARCHAR(64)
-- )
-- BEGIN
-- 	UPDATE SHIPMENT
-- 		SET status = _status, position = _position
--     WHERE id = _id;
-- END;//

-- DROP PROCEDURE IF EXISTS usp_ship_insert;
-- delimiter //
-- CREATE PROCEDURE usp_ship_insert(
--     IN	orderId		INT,
--     IN	productId	INT,
--     IN	shipmentId	INT,
--     IN	quantity	DECIMAL(10, 2),
--     IN	time		DATETIME,
--     IN	weight		DECIMAL(10, 2)
-- )
-- BEGIN
-- 	INSERT INTO SHIP VALUES(orderId, productId, shipementId, quantity, time, weight);
-- END;//

-- CALL usp_group_insert('Default', 5000000);
-- CALL usp_customer_insert('Khach hang B', 'HCMUT', '0123456789', '2001-11-22', null, null, null);

-- REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'user1'@'localhost';
-- GRANT EXECUTE ON new_schema.* TO 'user1'@'localhost';
-- CREATE USER 'user1'@'localhost' IDENTIFIED BY 'user1';
-- GRANT ALL ON CUSTOMER TO 'user1'@'localhost';
-- SHOW GRANTS;
-- GRANT EXECUTE ON new_schema.* TO 'user1'@'localhost';
-- GRANT ALL PRIVILEGES ON new_schema.* TO 'user1'@'localhost';
-- REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'user1'@'localhost';