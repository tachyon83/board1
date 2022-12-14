# 유저, 게시판, 댓글 구현

- 사용 기술
  - typescript
  - node
  - express (rest api)
  - typeorm
  - mysql
---

- 기능 구현
  - 유저
     - 회원가입
     - 로그인
     - 회원정보 수정
     - 회원탈퇴
  - 게시판
     - 게시글 작성
     - 게시글 확인
     - 게시글 검색
     - 게시글 삭제
     - 내가 쓴 글 확인
     - 게시판 댓글 및 대댓글

---

- 에러 처리
  - statusCode, e.message 통해 확인할 수 있도록 구현
  - src > utils > enums > ErrorString
  - src > configs > config.common.ts > ServerOptions > ERROR_LOGGING 통해 로그 토글 가능
  
---

- 로그
  - error_log 테이블에 발생 경로 등 저장

---

- `npm start` 통해 서버 시작 (포트:4000)
- `npm test` 통해 기능 테스트
- mysql port 는 3306 입니다. 
  - src > configs > port 에서 포트 변경 가능
---
  
- jwt 를 이용해 사용자 인증을 합니다.
  - 리프레시 토큰은 추가하지 않았습니다.
  - 토큰 시간 만료에 대해서도 대응하지 않았습니다.
- 모든 목록 조회 기능에서 페이징 기능 고려하지 않았습니다.
- 게시글에 붙은 모든 댓글 조회시 화면에 보이는대로 정렬해보려고 하였습니다.
  - 다만 내부적으로 재귀함수를 호출하고 있어서, 댓글의 양이 너무 많은 경우에는 문제가 발생할 수 있다는 점 인지하고 있습니다.
- 테스트 목적인만큼, 각종 secret (jwt secret)은 .env 같은 곳에 두지 않고 설정 파일에 노출되어 있습니다.


