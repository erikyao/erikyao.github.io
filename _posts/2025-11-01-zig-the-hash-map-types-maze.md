---
title: "Zig: the Hash Map Types Maze"
description: ""
category: Zig
tags: []
toc: true
toc_sticky: true
---

# 1. Zig's `HashMap` Hierarchy

If you've ever been confused by Zig's `HashMap` types, you're not alone. With 12 different `HashMap` types in the standard library and some misleading names, it can feel overwhelming. But there's actually a clear, logical structure once you understand the categorization.

## 1.0 The Big Picture: 12 Hash Maps, 3 Dimensions

Zig's hash maps vary across three independent dimensions:

1. **Storage Strategy**
   - Unordered: traditional implementation
   - Ordered: double-array implementation
2. **Contexy**
   - Manual: users have to specify `.ctx` attribute on initialization
   - `Auto`: pre-configured `.ctx` attribute for value key types, by standard lib
   - `String`: pre-configured `.ctx` attribute for string keys especially, by standard lib
3. **Memory Management**
   - Managed: memory allocation is delegated to `.allocator` attribute of the hash map instance (user gain convenience)
   - `Unmanaged`: users have to specify an `allocator` instance when using some APIs (users gain flexibility)

This gives us: $2 \times 3 \times 2 = 12$ total `HashMap` types. See [std](https://ziglang.org/documentation/master/std/).

## 1.1 Dimension 1: Storage Strategy

This is the most fundamental choice, as it affects performance characteristics and whether insertion order is preserved. In standard lib, they are even implemented as individual modules. See [hash_map.zig](https://ziglang.org/documentation/master/std/#src/std/hash_map.zig) and [array_hash_map.zig](https://ziglang.org/documentation/master/std/#src/std/array_hash_map.zig).


- `HashMap`: The classic hash table implementation. Fast lookups, but no order guarantees.
- `ArrayHashMap`: Uses arrays to store keys and values separately, with a hash table for indexing. Preserves insertion order.

**Performance note:** Array-backed maps are typically faster for iteration but may be slightly slower for lookups compared to traditional hash maps.
{: .notice--info}

## 1.2 Dimension 2: Context (i.e. Key Handling)

In Zig, a `Context` type that is essentially a set of the hashing and equality functions (similar to Python's `__hash__` and `__eq__` methods, or Java's `hashCode()` and `equals()`), determines how keys are hashed and compared. 

### 1.2.1 Manual Context: `HashMap` / `ArrayHashMap`

The base types where you provide everything yourself. Maximum control, maximum verbosity.

```zig
const std = @import("std");

var map = std.HashMap(
    []const u8,                       // key type
    i32,                              // value type
    std.hash_map.StringContext,       // .ctx
    80                                // .max_load_percentage (0 ~ 100)
).init(allocator);
```

Best when you have custom types needing special hashing or equality logic.
{: .notice--info}

### 1.2.2 `Auto` Context: `AutoHashMap` / `AutoArrayHashMap`

Uses Zig's automatic hashing (`std.hash.autoHash`) and equality comparison (`std.meta.eql(a, b)`). Works great for value types.

```zig
var m1 = std.AutoHashMap(u32, []const u8).init(allocator);
var m2 = std.AutoArrayHashMap(u32, []const u8).init(allocator);
```

**Works well with:**
- Integers (`u32`, `i64`, etc.)
- Enums
- Structs with value semantics (no internal pointers/slices)

**Does NOT work with:**
- Strings (`[]const u8`) - compares pointers, not content
- Slices in general
- Structs containing pointers (if you want deep equality)

**Important:** Despite the name, `AutoHashMap` is not truly "general purpose" – it's optimized for value keys only.
{: .notice--warning}

### 1.2.3 `String` Context: `StringHashMap` / `StringArrayHashMap`

Specialized for string keys (`[]const u8`). Hashes and compares string content, not pointers.

```zig
var m1 = std.StringHashMap(i32).init(allocator);
var m2 = std.StringArrayHashMap(i32).init(allocator);
```

Use when your keys are strings. This is the correct choice for string keys, not `AutoHashMap`.
{: .notice--warning}

## 1.3 Dimension 3: Memory Management

Every hash map type comes in two flavors:

### 1.3.1 Managed (Default)

Stores the allocator inside the hash map structure (as `.allocator`).

```zig
var map = std.AutoHashMap(u32, u32).init(allocator);
map.put(1, 100);        // no allocator parameter needed
map.remove(1);          // no allocator parameter needed
map.deinit();           // uses stored allocator
```

**Pros:** More convenient, less parameter passing
**Cons:** Slightly larger memory footprint (stores allocator pointer)

### 1.3.2 `Unmanaged`

Does not store the allocator. You must pass it to every method that allocates.

```zig
var map = std.AutoHashMapUnmanaged(u32, u32){};
map.put(allocator, 1, 100);      // must pass allocator
map.remove(allocator, 1);        // must pass allocator
map.deinit(allocator);           // must pass allocator
```

**Pros:** Smaller memory footprint, more flexible (can use different allocators)
**Cons:** More verbose, easy to forget allocator parameter

# 2. Summary

## 2.1 Naming Pattern

The naming follows a pattern like `[Context][Storage][Memory]`, like `StringArrayHashMapUnmanaged` = `String` context + `Array` storage + `Unmanaged` allocator.

## 2.2 Decision Tree: Which One Should I Use?

Follow this simple decision tree:

**1. Do I need insertion order preserved?**
   - No $\Rightarrow$ Use `HashMap` family
   - Yes $\Rightarrow$ Use `ArrayHashMap` family

**2. What are my keys?**
   - Strings $\Rightarrow$ Use `String*HashMap`
   - Integers/Enums/Simple structs $\Rightarrow$ Use `Auto*HashMap`
   - Custom types needing special hashing $\Rightarrow$ Use base `HashMap` / `ArrayHashMap`

**3. Do I want the convenience of stored allocator?**
   - Yes (most common) $\Rightarrow$ Use managed version (default)
   - No (need flexibility/smaller size) $\Rightarrow$ Use `*Unmanaged` version

## 2.3 Performance Considerations

`HashMap` (Traditional)
- **Lookups** Fast (O(1) average)
- **Iteration:** Slower, cache-unfriendly
- **Memory:** Moderate overhead per entry

`ArrayHashMap` (Array-backed)
- **Lookups:** Slightly slower (O(1) but with extra indirection)
- **Iteration:** Very fast, cache-friendly
- **Memory:** More efficient for dense maps

**Rule of thumb:** If you iterate frequently, use `ArrayHashMap`. If you mostly do lookups, use `HashMap`.
{: .notice--info}
