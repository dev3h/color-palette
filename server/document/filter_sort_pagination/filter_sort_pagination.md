- [tham khảo p1](https://jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/)
- [tham khảo p2](https://jeffdevslife.com/p/2-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/)

## note

- tìm hiểu thêm về regex

```js
{ $regex: queries.name, $options: "i" }
```

- options: i: không phân biệt hoa thường
- options: m: tìm kiếm nhiều dòng
- options: g: tìm tất cả các kết quả

- Trong postman khi truyền giá trị kiểu

```
heart[gt] 50
```

tức là `heart: {'gt': 50}`.
