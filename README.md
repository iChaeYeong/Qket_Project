# 🚀 (5조 인잇뿌볼) Qket 프로젝트

## 📌 Branch 전략

우리 프로젝트는 **Git Flow**의 간소화된 버전을 사용하여 개발을 진행합니다.

| 브랜치명 | 역할 | 설명 |
| :--- | :--- | :--- |
| `main` | 운영(Production) | 실제 서비스가 배포되는 기준 브랜치 |
| `dev` | 개발(Development) | 팀원들의 기능이 합쳐지고 테스트되는 브랜치 |

---

## 💻 개발 프로세스

새로운 작업을 시작하거나 완료했을 때 아래 순서대로 명령어를 실행해 주세요.

### 1. 로컬 환경 최신화

작업을 시작하기 전, 항상 `dev` 브랜치를 최신 상태로 유지합니다.

```bash
git checkout dev
git pull origin dev
```

### 2. 작업 브랜치 생성 및 작업

`dev` 기준으로 새 브랜치를 생성하고 이동합니다.

```bash
git checkout -b <새로_만들_브랜치_명> origin/dev
```

작업 진행 후 커밋합니다.

```bash
git add .
git commit -m "feat: 작업내용"
```

### 3. 작업 브랜치 푸시

로컬에서 작업한 내용을 원격 저장소에 업로드합니다.

```bash
git push origin <새로_만들_브랜치_명>
```

### 4. 최신 dev 반영 및 충돌 해결

다른 팀원이 먼저 작업물을 `dev`에 합쳤을 수 있으므로, 내 브랜치에 `dev`를 먼저 병합해 봅니다.

```bash
# 원격 dev의 최신 내용을 내 브랜치로 병합
git merge origin/dev
```

> 💡 만약 충돌(Conflict)이 발생하면 코드를 수정하고 다시 커밋하세요!

### 5. dev 브랜치에 내 작업 병합

로컬 `dev`로 이동해 최신화한 뒤, 본인의 작업 브랜치를 병합하고 푸시합니다.

```bash
# dev 브랜치로 이동 및 최신화
git checkout dev
git pull origin dev

# 내 작업 브랜치를 dev에 병합
git merge origin/<새로_만들_브랜치_명>

# 원격 dev에 최종 푸시
git push origin dev
```

---

## 📝 Commit Convention

일관된 프로젝트 히스토리를 위해 아래 규칙에 맞춰 커밋 메시지를 작성해 주세요.

| 타입 | 설명 |
| :--- | :--- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 스타일 수정 (기능 변경 없음) |
| `refactor` | 코드 구조 개선 |
| `test` | 테스트 코드 추가 |
| `chore` | 기타 작업 (빌드 설정 등) |

**예시**

- 기능 추가: `feat: 회원가입 기능 추가`
- 버그 수정: `fix: 로그인 오류 수정`
- 문서 수정: `docs: API 문서 업데이트`
- 코드 리팩토링: `refactor: 로그인 로직 개선`

---

## 아키텍처
<img width="1789" height="1273" alt="image" src="https://github.com/user-attachments/assets/2f4bed86-5458-4553-b6bf-6767d7f3cd10" />

