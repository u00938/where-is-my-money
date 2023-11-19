<div align="center">
  <img src="https://i.imgur.com/AcRV2KW.jpg" alt="logo" align="center" width="60%" />  
</div>


# 💸WHERE IS MY MONEY - 예산 관리 어플리케이션

**원하는만큼 한달 예산을 설정하고, 지출을 관리합니다**

사용자들이 개인 재무를 관리하고 지출을 추적하는 데 도움을 주는 애플리케이션입니다. 예산을 설정하고 지출을 모니터링하며 재무 목표를 달성하는 데 도움이 됩니다. 원하는 시작 날짜에 맞춰 한달 간 내가 설정한 예산에 맞게 지출을 관리할 수 있습니다. 카테고리 별로 관리가 가능하며, 서비스 신청 시 디스코드를 통해 오늘 지출 내용을 받아볼 수 있습니다.

<br/>

## Table of Contents

- [개요](#개요)
- [API Reference](#api-reference)
- [ERD](#ERD)
- [프로젝트 진행 및 이슈 관리](#프로젝트-진행-및-이슈-관리)
- [구현과정(설계 및 의도)](#구현과정(설계-및-의도))
- [TIL 및 회고](#til-및-회고)
- [Authors](#authors)

<br/>

## 개요

개개인의 지갑 사정에 알맞는 예산을 스스로 설정하고 지출을 관리해주는 이 서비스는 남은 일자와 예산에 맞게 하루 지출 바운더리를 설정해주고, 현재 내 소비율의 지표를 모니터링할 수 있게 해줍니다. 또한 다른 사용자들과 비교하여 내 소비율은 어느정도인지 체크하고 소비를 조절할 수 있게 됩니다.

사용자들은 카테고리 별로 예산을 각각 설정할 수 있습니다. 그러나 예산을 나누기 어려운 사용자를 위해 다른 사용자들이 자신들의 예산을 어떻게 분배하는지를 분석하여 내 예산 내에서 자동 추천, 설계해주는 서비스를 제공합니다. 
또한 예산을 기준으로 오늘 소비 가능한 지출을 알려주며, 매일 발생한 지출을 카테고리 별로 안내받을 수 있습니다. 


<br/>

<br/>

## Skils

<div align="center">

언어 및 사용 도구 <br/> ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Swagger](https://img.shields.io/badge/swagger-%ffffff.svg?style=for-the-badge&logo=swagger&logoColor=white)
<br/>
데이터 베이스 <br/>![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)<br/>

</div>

<br/>

## Directory


- **파일 구조 보기**

```
src
├─cache
├─config
├─loader
│  └─exception
├─model
│  └─entities
├─modules
│  ├─auth
│  ├─budget
│  ├─user
│  └─webhook
└─util

app.module.ts
main.ts
```

이전 프로젝트에서는 한 모듈에 컨트롤러, 모델, 레파지토리, 서비스가 각각 나눠져 있었습니다. 하지만 모델의 경우 여러 모듈에서 사용하는 경우가 있어 한군데에 모아두는 것이 좋겠다고 생각해 이러한 구조를 선택했습니다.

그리고 큰 용도로 나누어 비슷한 역할을 하는 파일끼리 모아 최대한 가독성 좋고 이해하기 쉬운 폴더 구조를 만들려고 했습니다. 예를들면 앱을 시작하는 데에 필요한 모듈이나 연결 로직들 같은 경우 app.ts나 app.module.ts 에 전부 다는 것이 아닌 한 폴더에 모아 app.module로 가져오는 식으로 구현하기 위해 loader라는 폴더를 만들었습니다. 다만 loader 내에서도 모듈인것과 아닌것이 나눠져있어 이를 정리하는 방법을 좀 더 연구해보고자 합니다.


</br>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development(nodemon)
$ npm run start
```

## API Reference

Swagger : http://localhost:{port}/swagger#/

```
// 추후 CRUD 완성 후 업데이트
```

<br/>

## ERD

<img src="https://i.imgur.com/QhtnsC6.png" alt="logo" width="90%" />

#### 설계 의도

- **[user_budget]**

  - 전체 예산 관리 테이블
  - 유저가 시작 날짜(period_start)를 설정 시 자동으로 한달 기간으로 종료 날짜(period_end)를 넣도록 했고, 현재 관리 진행 중인 예산은 `BETWEEN period_start AND period_end` 조건으로 조회하도록 했습니다.
  - 해당 예산 관리 시에 전체 누적 지출 금액을 저장하는 컬럼(acc_spend)을 만들었습니다.

- **[user_budget_category]**

  - 카테고리별 예산 관리 테이블
  - fk로 **[user_budget]** 테이블과 연결. 카테고리 항목은 **[budget_category]** 테이블에서 관리. 식비, 주거, 문화, 기타 등을 기본으로 넣고 추후 추가하거나 수정할 수 있습니다.
  - 통계를 위해 예산 설정 시 각 카테고리에 분배한 예산이 전체 예산에서 차지하는 비율을 각각 계산해 저장하는 용도의 컬럼을 만들었습니다.
  - 해당 예산 관리 시에 카테고리 별 누적 지출 금액을 저장하는 컬럼(acc_spend)을 만들었습니다. 지출 컬럼 업데이트 시 해당 컬럼에 연결된 총 예산 관리 테이블 컬럼의 지출 금액을 함께 업데이트 하기 위해 before update 트리거를 생성해 자동 업데이트 되도록 만들었습니다.∨

```sql
-- [user_budget_category] before update trigger

CREATE DEFINER=`root`@`localhost` TRIGGER `t_user_budget_category_BEFORE_UPDATE` BEFORE UPDATE ON `user_budget_category` FOR EACH ROW BEGIN
	DECLARE num INT;
    
    SET num = NEW.acc_spend - OLD.acc_spend;

    IF num > 0 THEN
		UPDATE user_budget
        SET acc_spend = acc_spend + (NEW.acc_spend - OLD.acc_spend)
        WHERE id = NEW.user_budget_id;
	-- TODO: 줄어들었다면 줄어든만큼 깎아야됨
	END IF;
END
```

- **[user_spend_history]**

  - 지출 내역 관리 테이블
  - 지출 금액, 지출 날짜, 합계 여부를 선택할 수 있습니다. fk로 **[user_budget_category]** 테이블과 연결되어 before insert 트리거를 통해 해당 컬럼의 누적 지출을 update하도록 합니다. 합계 제외된 경우 계산하지 않습니다.∨

```sql
-- [user_spend_history] before insert trigger

CREATE DEFINER=`root`@`localhost` TRIGGER `t_user_spend_history_BEFORE_INSERT` BEFORE INSERT ON `user_spend_history` FOR EACH ROW BEGIN
	-- 마이너스 값 허용 -> 초과된 금액 or 최솟값으로 보여주면 될듯
    IF NEW.spend_amount > 0 AND NEW.is_sum = TRUE THEN
		UPDATE user_budget_category
        SET acc_spend = acc_spend + NEW.spend_amount
        WHERE id = NEW.user_budget_category_id;
	END IF;
END
```


<br/>

## 프로젝트 진행 및 이슈 관리

[![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/Where-s-My-Money-8b6bb3a5394d4f87ba7b89680e5f8d80)

[프로젝트 관리 페이지](https://www.notion.so/dev-j/must-Go-077b850837b743fbbbd59cc33a7e51ca?pvs=4)

<img src="https://i.imgur.com/gHA5Y15.png" alt="logo" width="90%" />

<br/>

[+ 깃헙 이슈/프로젝트 관리](https://github.com/users/u00938/projects/1)



<br/>

## 구현과정(설계 및 의도)

### 기본키 생성

- **trigger vs. function => DB function**

  1. 기본키는 보안과 관리 면에서 합리적인 방식을 생각해 각 테이블의 `시퀀스네임+숫자 증가` 조합으로 생성하도록 했습니다.
    - 관련 TIL: [기본키 생성 전략](https://www.notion.so/dev-j/e601ed909781473e90f7feb4d10ec8c6)
  2. `[id_sequnce]` 테이블에 시퀀스를 관리하며 일정 숫자가 넘어가면 다시 1부터 시작하는 방식으로, 테이블의 row 수를 예측하기 어렵게 했습니다.
  3. before insert 트리거를 이용해 생성하는 전략을 사용할 수도 있었지만, db function의 기능을 이용해 새 id 시퀀스 값을 리턴받아 사용하기 위해 따로 function을 사용하기로 했습니다. id값이 유효한지 검증하거나, 바로 받아 fk로 연결된 테이블에 함께 insert할 때도 유용합니다.
  4. user, history같은 많은 데이터가 저장될 것으로 예상되는 테이블에는 30자리 시퀀스를, 기본적인 관리 테이블같은 경우 12자리 시퀀스를 사용하도록 했습니다.

```sql
-- 12자리 id 생성 function
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_get_seq_12`(p_seq_name VARCHAR(2)) RETURNS varchar(12) CHARSET utf8mb4
BEGIN
    DECLARE RTN_VAL VARCHAR(12);

    INSERT INTO id_sequence (id, no)
    VALUES (p_seq_name, LAST_INSERT_ID(1))
    ON DUPLICATE KEY UPDATE no = IF(LAST_INSERT_ID(no + 1) = 10000, LAST_INSERT_ID(1), LAST_INSERT_ID(no + 1));

    SET RTN_VAL =
            (SELECT CONCAT(p_seq_name, CONCAT(DATE_FORMAT(NOW(), '%y%m%d'), LPAD(LAST_INSERT_ID(), 4, '0'))));

    RETURN RTN_VAL;
END

-- 30자리 id 생성
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_get_seq_30`(p_seq_name VARCHAR(4)) RETURNS varchar(30) CHARSET utf8mb4
BEGIN
    DECLARE RTN_VAL VARCHAR(30);

    INSERT INTO id_sequence (id, no)
    VALUES (p_seq_name, LAST_INSERT_ID(1))
    ON DUPLICATE KEY UPDATE no = IF(LAST_INSERT_ID(no + 1) = 10000, LAST_INSERT_ID(1), LAST_INSERT_ID(no + 1));

    SET RTN_VAL =
            (SELECT CONCAT(p_seq_name, CONCAT(DATE_FORMAT(NOW(), '%y%m%d%H%i%s'), LPAD(LAST_INSERT_ID(), 6, '0'))));

    RETURN RTN_VAL;
END
```

- **생성 예시**

<img src="https://i.imgur.com/u8mxZOb.png" alt="logo" width="50%" />

### 유저 등록

- **회원가입**

  1. `계정`은 유저의 id를 기입

  - 계정 생성시 테이블에 Trigger로 유저의 id가 생성되며 [EUID + YYYYMMDDHHmmss + 6자리의 일련번호] 형식으로 생성

  2. `비밀번호`는 아래와 같은 `제약 조건`을 가지며, `암호화`하여 데이터베이스에 저장

  - 비밀번호는 최소 10자 이상
  - 숫자, 문자, 특수문자 3가지를 포함해야합니다.

- **로그인**

  1. 계정, 비밀번호로 로그인 시 JWT토큰이 발급됩니다.
  2. 이후 게시물, 통계 API 요청 Header에 Access token가 항시 포함되며, JWT 유효성을 검증합니다.
  3. ~~추후 refresh token 추가 예정~~


### 통계 데이터 캐싱 - local

- **카테고리 별 예산 통계**

  1. 예산 추천을 위한 전체 유저들의 카테고리 별 예산 분배 비율을 캐시에 저장했습니다. 계산 로직이 복잡하지는 않지만 매번 요청시마다 새로 계산하는 과정을 생략할 수 있습니다. 각자 예산 대비 비율은 컬럼에 저장되어있기 때문에 각 카테고리별로 묶어 평균을 내어 계산합니다.
  2. 10% 이하의 항목들은 함께 묶어 '기타'로 저장
  3. 하루 한번 스케줄을 통해 저장하도록 하기 위해 자정 1분마다 실행하게 하고 오늘 날짜를 함께 저장하여 캐시 조회 시 오늘 날짜가 아닐 경우 캐시 저장 method를 호출하여 갱신하도록 했습니다.

- **소비율 통계**

  1. 통계 파트에서 다른 유저 대비 소비율을 계산하기 위해 유저 전체의 소비율을 계산하여 캐싱합니다. 현재 관리 중인 유저들의 예산 컬럼을 기간으로 조회합니다. 각자 설정된 기간과 예산을 이용해 오늘 날짜까지의 권장 지출액을 계산하여 그에 대비 현재 지출금액의 비율을 계산합니다.
  2. 전체 예산 소비율, 각 카테고리별 소비율을 따로 계산해 저장합니다. 또한 날짜를 함께 저장해 조회 시 확인 후 오늘 날짜가 아니면 갱신하는 방법으로 최신 정보를 받아볼 수 있게 합니다.

- **local vs. redis**

  1. 현재는 작은 한 서버에서 진행하고 있기 때문에 우선 local 캐시를 이용하도록 했습니다. 그러나 실제 서비스한다면 메인 api 서버, 스케줄러 서버, 캐시 서버 등 각자 독립적인 서버로 운영하고 그에 따라 서버 간 소통이 가능하도록 레디스 서버를 이용할 것 같습니다. (추후 msa까지는 아니더라도 해당 프로젝트에 레디스 모듈을 추가할 예정)
  2. 레디스 캐시 서버 생성 시 pub/sub을 사용해 캐시 저장 후 채널에 publish 하고, 메인 api 서버(본 서버)에 해당하는 채널을 구독하는 이벤트 subscriber를 추가하여 캐시 조회 후 로컬 캐시에 가공하여 저장하는 방식을 채택할 것입니다. 캐시 사용 시 레디스 서버를 매번 조회하는 것 보다 한번 저장 후 필요할때마다 로컬 캐시를 조회하는 것이 비용적으로 절약되는 방향이라 생각합니다.

### Discord Webhook을 활용한 지출 추천 서비스

- **서비스 소개 및 로직**

  1. 유저 중 디스코드 컨설팅/지출 추천 서비스를 신청 한 사용자 대상으로 매일 아침 8시 지출 추천 금액 내용을 제공
    - 오늘 지출 가능한 전체 금액 (남은 금액, 남은 기간으로 계산)
    - 오늘 지출 가능한 카테고리별 금액
    - 남은 금액이 없을 경우 마이너스가 아닌 최소 금액으로 보이도록 함
  2. 소비율(위험도)에 따른 메시지를 함께 전송
    - 아끼는 상황(소비율 80% 미만): 절약을 잘 실천하고 계시네요!🎊 앞으로도 지금처럼만~
    - 기준을 넘김(100% 이상): 절약 실패..😱 하지만 다음달에 다시 도전해봅시다
    - 그 사이 적당한 소비: 잘 하고있지만 위험 수준이에요!🚨 조금만 더 절약해봐요!
    - 메시지 내용 또한 관리자가 자유롭게 수정할 수 있도록 따로 관리 테이블과 컬럼이 있으면 좋을듯
  3. @nestjs/schedule의 cron을 통헤 스케줄 등록

- **유저 대상자 조회**

  1. 서비스 사용자 정보가 담기는 테이블 `[user_discord_service]`
  2. 해당 서비스 아이디를 가진 유저를 조회 `service_id = consulting_guide`

- **메시지 가공 후 전송**

  1. 디스코드 웹훅 메시지 포맷으로 완성
  2. @nestjs/axios 사용하여 유저의 디스코드 웹훅 url로 post 요청

<img src="https://i.imgur.com/I8WGvJC.png" alt="logo" width="90%" />


### Discord Webhook을 활용한 지출 안내 서비스

- **서비스 소개 및 로직**

  1. 유저 중 디스코드 컨설팅/지출 안내 서비스를 신청 한 사용자 대상으로 매일 저녁 10시 지출 금액 내용을 제공
    - 오늘 지출 총액
    - 오늘의 카테고리별 지출
    - 각자 권장 금액 대비 지출 금액을 계산한 소비율(위험도)
  2. @nestjs/schedule의 cron을 통헤 스케줄 등록

- **유저 대상자 조회**

  1. 서비스 사용자 정보가 담기는 테이블 `[user_discord_service]`
  2. 해당 서비스 아이디를 가진 유저를 조회 `service_id = consulting_notify`

- **메시지 가공 후 전송**

  1. 디스코드 웹훅 메시지 포맷으로 완성
  2. @nestjs/axios 사용하여 유저의 디스코드 웹훅 url로 post 요청

<img src="https://i.imgur.com/TvafRlo.png" alt="logo" width="90%" />


<br/>

## TIL 및 회고

- [기본키 생성 전략](https://www.notion.so/dev-j/e601ed909781473e90f7feb4d10ec8c6?pvs=4)
- [에러 핸들링](https://www.notion.so/7962f9852c274cf59bbedac19db1e960?pvs=4)


<br/>

## Authors

<div align="center">

</br>

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

<a href="https://github.com/u00938">김유영</a>

</div>
<br/>
