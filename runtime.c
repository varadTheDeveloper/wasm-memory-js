#include <stdlib.h>

char* alloc(int size) {
    return (char*)malloc(size);
}

void release(char* ptr) {
    free(ptr);
}