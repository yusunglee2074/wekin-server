const { springPageable } = require('./pageable')


exports.pageable = springPageable

// 현재 페이지
exports.getNumber = () => {
}
// 페이지 크기
exports.getSize = () => {
}
// 전체 페이지 수 
exports.getTotalPages = () => {
}
// 현재 페이지에 나올 데이터 수
exports.getNumberOfElements = () => {
} 
// 전체 데이터 수
exports.getTotalElements = () => {
}
// 이전 페이지 여부
exports.hasPreviousPage = () => {
}
// 현재 페이지가 첫 페이지 인지 여부
exports.isFirstPage = () => {
}
// 다음 페이지 여부
exports.hasNextPage = () => {
}
// 현재 페이지가 마지막 페이지 인지 여부
exports.isLastPage = () => {
}
// 다음 페이지 객체
exports.nextPageable = () => {
}
// 이전 페이지 객체
exports.previousPageable = () => {
}
// 조회된 데이터
exports.getContent = () => {
}
// 조회된 데이터 존재 여부
exports.hasContent = () => {
}
// 정렬 정보
exports.getSort = () => {
}



