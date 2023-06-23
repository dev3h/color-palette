- check mongoose connection state: (check)[https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection]
- Nếu lỗi connect mongodb mà đã đảm bảo các bước thì thay mongodb://localhost:27017 thành `mongodb://127.0.0.1:27017`: (doc)[https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017]

## Cài extention

- Mongo snippets for node js
- gõ `!mdbgum` đeể tạo nhanh schema

## mongoose model

- [model](https://mongoosejs.com/docs/models.html)
- [api model](https://mongoosejs.com/docs/api/model.html)

## Các hàm của sequelize

| Stt |           Tên           |                                      Mô tả                                      |                                                                          Link |
| :-- | :---------------------: | :-----------------------------------------------------------------------------: | ----------------------------------------------------------------------------: |
| 1   |      **create()**       |                             tạo và lưu vào db luôn                              |                https://mongoosejs.com/docs/models.html#constructing-documents |
| 2   |      **findOne()**      |            tìm bản ghi với điều kiện là thỏa mãn obj truyền vào func            |          https://mongoosejs.com/docs/api/query.html#Query.prototype.findOne() |
| 3   |     **findById()**      |                   tìm bản ghi theo Id - tốc độ tìm nhanh hơn                    |                   https://mongoosejs.com/docs/api/model.html#Model.findById() |
| 4   |      **select()**       | chọn những cái gì cần lấy ra, cái gì ko cần lấy thì thêm dâu `-` vào đằng trước | https://mongoosejs.com/docs/api/schematype.html#SchemaType.prototype.select() |
| 5   | **findByIdAndUpdate()** |                          tìm bản ghi theo id và update                          |          https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate() |
| 6   | **findOneAndUpdate()**  |                       tìm bản ghi theo 1 trường và update                       |           https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate() |
| 7   |       **find()**        |                             lấy tất cả các bản ghi                              |                       https://mongoosejs.com/docs/api/model.html#Model.find() |
| 8   | **findByIdAndDelete()** |          tìm và xóa bản ghi có id truyền vào, trả về bản ghi bị xóa đó          |          https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete() |
| 9   |  **countDocuments()**   |                     đêm số lượng bản ghi thỏa mãn điều kiện                     |             https://mongoosejs.com/docs/api/model.html#Model.countDocuments() |
| 10  |       **skip()**        |                            bỏ qua bao nhiêu bản ghi                             |             https://mongoosejs.com/docs/api/query.html#Query.prototype.skip() |
| 11  |       **limit()**       |                        giới hạn số lượng bản ghi trả về                         |            https://mongoosejs.com/docs/api/query.html#Query.prototype.limit() |
| 12  |     **populate()**      |                    lấy dữ liệu giữa các bảng có ref với nhau                    |                                     https://mongoosejs.com/docs/populate.html |

## toJSON, toObject

- [virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html)

```js
toJSON: { virtuals: true },
toObject: { virtuals: true },
```

- `toJSON` sẽ chạy khi dùng `res.json()` hoặc `res.send()`
- `toObject` sẽ chạy khi dùng `res.render()`
- `virtuals: true` để chạy virtual field, tức là nó sẽ lấy ra các field mà không có trong bảng mà ta đã định nghĩa

## pre save

```js
Ten_schema.pre("save", async function (next) {
  /// handle
  next();
});
```

## method

- Nếu chỉ cần định nghĩa 1 method

```js
Ten_schema.methods.ten_method = function () {
  // handle
};
```

- Nếu cần định nghĩa nhiều method

```js
Ten_schema.methods = {
  ten_method1: function () {
    // handle
  },
  ten_method2: function () {
    // handle
  },
};
```

## $set, $push, $pull

- `$set` để update 1 field
- `$push` để thêm 1 phần tử vào mảng
- `$pull` để xóa 1 phần tử trong mảng

## $ins

- [doc](https://www.mongodb.com/docs/manual/reference/operator/update/inc/)
- `$inc` để tăng giá trị

## Lấy dữ liệu giữa các collection có ref tới nhau thông qua populate

- Điều kiện là phải có kiểu `objectId` và phải có `ref` tới collection đó
- Truyền key của bảng schema có chứa ref thông qua `path`, vào truyền những thứ muốn lấy với `select`

```js
populate([
  { path: "tags.colorTags", select: "name" },
  { path: "tags.collectionTags", select: "name" },
  { path: "likes", select: "displayname email" },
]);
```

## Note

- Không phải tạo tên database trong mongo compass. Khi connect nếu nó ko thấy nó sẽ tự tạo cho chúng ta database đó
- Thằng mongoose nó tự tạo cho mình 1 cái id nên không cần phải tạo id nữa. Và nó sẽ ko đọc đươc arrow function
- Liên kết khóa ngoại

```js
address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
}
```

- Do lúc tạo schema đã có validate rồi nên không cần phải validate nữa
- Thằng mongoose sẽ trả về 1 instance obj. Nên nếu muốn plain obj thì dùng `.toObject()`
- Lúc update lại 1 số trường thì phải dùng `save()` thì nó mới lưu thay đổi
