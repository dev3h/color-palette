- check mongoose connection state: (check)[https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection]
- Nếu lỗi connect mongodb mà đã đảm bảo các bước thì thay mongodb://localhost:27017 thành `mongodb://127.0.0.1:27017`: (doc)[https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017]

## Cài extention

- Mongo snippets for node js
- gõ `!mdbgum` đeể tạo nhanh schema

## mongoose model

- [model](https://mongoosejs.com/docs/models.html)
- `create()` là tạo và lưu vào db luôn

## pre save

```js
Ten_schema.pre("save", async function (next) {
  /// handle
  next();
});
```

## Note

- Không phải tạo tên database trong mongo compass. Khi connect nếu nó ko thấy nó sẽ tự tạo cho chúng ta database đó
- Liên kết khóa ngoại

```js
address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
}
```

- Do lúc tạo schema đã có validate rồi nên không cần phải validate nữa
