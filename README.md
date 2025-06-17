# Home Tour

> Dự án **Home Tour** gồm hai thành phần chính:
> 1. **backend_v2** – API NestJS (TypeScript, PostgreSQL, JWT).
> 2. **mobile** – Ứng dụng React Native dùng Expo.

## Kiến trúc
```
Mobile (Expo/React Native) ⇄ REST API (NestJS) ⇄ PostgreSQL
```

## Công nghệ chính
| Thành phần | Stack |
|------------|-------|
| Backend v2 | NestJS 10, TypeORM 0.3, PostgreSQL, JWT, Swagger |
| Mobile     | React Native 0.79, Expo 53, Tamagui UI, Axios |

## Cấu trúc thư mục
```
├── backend_v2/   # Source NestJS API
├── mobile/       # Ứng dụng React Native
└── README.md
```

## Thiết lập nhanh
### Backend v2
```bash
cd backend_v2
npm i
cp .env.example .env   # cập nhật DATABASE_URL, JWT_SECRET...
npm run start:dev       # http://localhost:3000 (Swagger tại /api)
```
### Mobile
```bash
cd mobile
npm i
expo start             # iOS/Android/Web
```

## Testing
- Backend: `npm test`.
- Mobile: `expo test` *(nếu cấu hình)*.

## Đóng góp
Pull Request kèm mô tả chi tiết. Tuân thủ eslint & prettier.

## Giấy phép
UNLICENSED – Chỉ dùng nội bộ.