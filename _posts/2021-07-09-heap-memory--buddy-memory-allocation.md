---
layout: post
title: "heap memory / Buddy Memory Allocation"
description: ""
category: OS
tags: []
---
{% include JB/setup %}

## 1. 再谈 heap

之前在 [Linking, Loading and Library](https://blog.listcomp.com/os/2016/06/29/linking-loading-and-library) 里讲过，OS 把 application "由代码变成进程" 的这个过程 (i.e. loading) 中，会给进程申请两块 VMA (Virtual Memory Area)，一个是 stack，一个是 heap。

- 这个 stack memeory，是真的是一个 stack data structure；
- 但是这个 heap memory，和 heap data structure **没有半毛钱关系！**

我也不晓得老外为啥要死盯着 heap 这个词不放。叫 "pool memory" 或者 "storage memory" 之类的不行吗？反正 C++ 是不用 "heap memory" 这个词的，它用的是 ["dynamic storage"](https://timsong-cpp.github.io/cppwp/n3337/basic.stc) 这个概念。Knuth 有一个感觉像是吐槽的论述：

> Several authors began about 1975 to call the pool of available memory a "heap." But in the present series of books, we will use that word only in its more traditional sense related to priority queues. (Fundamental Algorithms, 3rd ed., p. 435)

但其实 ALGOL 68 (which of course was invented in 1968) 就有一个关键字 `heap` 用来声明一个位于 heap memory 中的 variable，比如 `heap real w : = 10.5;`。

而 heap data structure 的历史可以追溯到 1964 年，[J. W. J. Williams](https://en.wikipedia.org/wiki/J._W._J._Williams) 发明了 binary heap。

还是那句话，不怕英文有多难，就怕老外自己瞎搞。

## 2. Buddy Memory Allocation

我在 stack overflow 上看到有人说：

> ”有个内存分配算法 (which 当然分配的是 heap memory；联系 `malloc()`) 叫 **Buddy Memory Allocation** (使用这个算法的内存管理系统也叫 **Buddy System**)，它的实现**好像**本质上是个 heap data structure？是不是因为这个原因 heap memory 才叫的 heap? “

我要说这也是鬼扯！反正我用 heap data structure 实现不了。

### 2.1 Allocation 的思路

那来都来了，我们就先来看看 allocation 算法。与其说是算法，我觉得不如说是个 policy。

它假设我们有一个连续的 memory 段，假设 size 是 $2^n$ (单位是 bit、byte 或是 page 都不重要)。这么大一块 memory 会被划分成多个 block，每个 block 的 size 限定是 $2^m$ 的形式 ($m=0, 1, \dots, n$)，且任意两个 block 不重叠。但是这个划分不是预先就做好的，而是由 memory request 触发的，然后自适应地、动态地维护的。最适合 memory request 的一个 block 会被 allocate，返回给用户。

假设我们用一个 array (or dict) of block lists (以下记做 $B$) 来记录 available 的 blocks：

```python
# array of block lists
B = [
    [size_1_block, ...],  # index == 0，对应 size 为 2^0 的 block list
    [size_2_block, ...],  # index == 1，对应 size 为 2^1 的 block list
    [size_4_block, ...],  # index == 2，对应 size 为 2^2 的 block list
    ...
    [size_1024_block, ...],  # index == 10，对应 size 为 2^10 的 block list
    ...
]

# dict of block lists
B = {
    0: [block, ...],  # size 为 2^0 的 block list
    1: [block, ...],  # size 为 2^1 的 block list
    2: [block, ...],  # size 为 2^2 的 block list
    ...
    10: [block, ...],  # size 为 2^10 的 block list
    ...
    n: [block, ...],  # size 为 2^n 的 block list
}
```

当接收到一个 size 为 $2^r$ 的 request 时：

1. 如果 $2^r$ 大于 $2^n$，说明申请的 memory 大于系统总量，申请失败
2. 循环 $i = r \ldots n$，找出最小的 $i = k$ 满足 $B[i]$ 非空，取 block $B[i][0]$
   1. 如过找不到满足条件的 $k$，说明系统当前 available 的 memory 不足，申请失败 
      - 这里其实有个 assumption 就是在 `free()` 的时候，物理地址相邻的、且 size 相同的两个 blocks (即名称中的 buddies) 是会被合并的
        - 注意是物理地址相邻，不是在 block list 里相邻
        - 比如你申请了 $[0, 32)$ 和 $[32, 64)$，你 `free()` 之后它们会合并成 $[0, 64)$ (如果 $[64, 128)$ 也是 available 的话，会进一步合并成 $[0, 128)$；依此类推)
      - 有了这个 assumption，就不可能出现 "我仅剩两个相邻的 32-bit blocks 但我申请 64-bit 失败了" 这样的情况
   2. 如果 $k == r$，则直接 return block $B[i][0]$
   3. 如果 $k > r$，则将 $B[k][0]$ 进一步 split，最终的结果是：
      1. $B[k][0]$ 被 pop 
      2. $B[k-1], B[k-2], \dots, B[r+1], B[r]$ 被初始化
        - 注意此时我们已经确定 $B[k-1], B[k-2], \dots, B[r+1], B[r]$ 都是 empty 的
      3. $B[r]$ 的第一个 block 被 return 给用户

split 的结果就是 size 为 $2^k$ 的 block 被拆成了 $2 \times 2^r, 2^{r+1}, 2^{r+2}, \dots, 2^{k-2}, 2^{k-1}$，等比数列算一下就能发现 size 重量是相同的。举个例子，假设有 $n = 9, 2^n = 512$ 总量的 memory，我要申请一个 $r=6, 2^r=64$ 的 block。系统起始一定是只有一个 available 的 block 就是 $B[9][0] = [0, 512)$。划分后的结果是：

```python
B = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [range(0, 64), range(64, 128)],  # size = 64
    7: [range(128, 256)],  # size = 128
    8: [range(256, 512)],  # size = 256
    9: [],
}
```

然后 `range(0, 64)` 被 pop 并 return 给用户

- 实现的时候可以不用把这个 block `range(0, 64)` 初始化到 $B[6]$ 再 pop 出来；有简单的做法，参后面的实现细节

### 2.2 Deallocation 的思路

那有 allocation 就有 de-allocation。而且在 de-allocation 的时候，"buddy" 这个概念才有更大的作用。

前面讲过，如果一开始就有一个 size 为 $2^r$ 的 request 进来，会划分出两个 size 为 $2^r$ 的 blocks。这两个 blocks 是一对 buddies。既然是一对，那就可以区分左和右，这个左右关系可以用 `buddy_number` 的奇偶来表示，简单来说：假设总 memory 的 address 范围是 $[\Phi, \Phi + 2^n)$，假设一个 block $b$ 的 address 范围是 $[\phi, \phi + 2^r)$，那么 `buddy_number` 可以这么计算：

$$
\operatorname{f_{bn}}(b) = (\Phi - \phi) \div 2^r
$$

- 如果 $\operatorname{f_{bn}}(b) \equiv 0 \pmod{2}$，说明 $b$ 是 left buddy，它的 right buddy $b'$ 的范围是 $[\phi + 2^r, \phi + 2^{r+1})$
- 如果 $\operatorname{f_{bn}}(b) \equiv 1 \pmod{2}$，说明 $b$ 是 right buddy，它的 left buddy $b'$ 的范围是 $[\phi - 2^r, \phi)$

当我们要 de-allocate $b$ 时，我们首先确定 $b'$，如果 $b'$ 在 $B[r]$ 中，说明 $b$ 和 $b'$ 可以合并成一个大的 available block $c$，再算出它的 buddy $c'$，再去查 $B[r+1]$...依此类推，直到不能合并为止。

- 这个 "合并" 有个专有的叫法: [coalesce](https://www.memorymanagement.org/glossary/c.html#term-coalesce)

将 $b$ 添加到 $B[r]$ 的过程也有讲究。虽然我没有找到算法严格的定义，但似乎我们应该要保持 $B[r]$ 是 sorted 的

### 2.3 参考实现：直接搬出Knuth

Buddy 的实现细节还是蛮多的，我们直接拿 _TAOCP Volumne 1, Chapter 2, Information Structures: Sections 2.5, 2.6_ 来研究。

Knuth 大神的写法乍看起来非常不好懂，我这里铺垫一下应该就好理解了。

#### Knuth 用的链表

首先注意他用的 list 结构是一个 "有 dummy head 的 cyclic 的双向链表"，而且：

- 他用 _backward_ 表示 `node.next` 或者说是 `node.right` 方向 (朝向链表的 backend，也说得通...)
- 他用 _forward_ 表示 `node.previous` 或者说是 `node.left` 方向

非常的别扭。

他这个链表有这么些特点：

- `dummy_head.backward == first_node`
- `dummy_head.forward == last_node`
- `last_node.backward == dummy_head`

#### 以 address 为中心的设计

可以说大神的写法非常不 OO，但其实他有围绕一个中心概念来实现，这个中心概念就是 **address**。他的这两个函数应该这样理解：

- `TAG(address) = 0/1` 表示起始位置在 `address` 的 block 是否 available
- `KVAL(address) = k` 表示起始位置在 `address` 的 block 的 size 是 `2 ** k`

所以他虽然没有给 block 这个概念建个数据结构，但其实都用 address 来隐式地表达了。

而且他 allocation 返回给用户的也是 address，和 `malloc()` 一致。我自己用 OO 实现的时候最初返回的是 block，但其实是不对的，即我用 OO 实现也应该是返回 address，这点后续再展开。

#### 队首还是队尾？

最后两个实现细节：

1. allocation 的时候，如果定位了 `AVAIL[j]` (即我们的 $B[k]$)，那么他是直接取第一个 block 来 split
2. deallocation 的时候，如果不能 coalesce 了，它会把手头上的 block (起始位置为 `L`) append 到 `AVAIL[k]`
  - 理论上来说，你 insert 到 `AVAIL[j]`队首也是可以的
  - Knuth 有讲：所有的 `AVAIL[j]` 也可以都 maintain 成 sorted list，这是另一种实现

### 2.4 我的回合

```python
from dataclasses import dataclass

def calculate_bsize(size):
    power, bsize = 1, 0
    while power < size:
        power <<= 1
        bsize += 1
    return bsize

@dataclass
class Block:  
    address: int
    bsize: int
    available: bool
        
    def get_size(self):
        return 2**self.bsize
    
    def get_buddy_address(self):
        size = self.get_size()
        buddy_number = self.address // size

        if buddy_number % 2:  # odd; self is right buddy
            return self.address - size
        else:  # even; self is left buddy
            return self.address + size

class MemoryManager:
    def __init__(self, size):
        self.m = calculate_bsize(size)
        self.available_blocks = [[] for _ in range(0, self.m + 1)]
        
        init_block = Block(0, self.m, available=True)
        self.available_blocks[-1].append(init_block)
        
        # The buddy of the init_block will have an address starting at `size`
        # Add a dummy entry <size: None> to avoid KeyError
        self.address_to_block = {0: init_block, size: None}
        
    def allocate(self, size): 
        k = calculate_bsize(size)
        
        # find the smallest integer j that k <= j <= n and self.available_blocks[j] is not empty
        for j in range(k, self.m + 1):
            if self.available_blocks[j]:
                break
                
        block = self.available_blocks[j].pop(0)
        block.available = False  # occupied by this request
        
        if j == k:
            return block.address
        
        while j > k:
            j -= 1
            
            new_block_address = block.address + 2**j 
            new_block = Block(new_block_address, j, available=True)
            
            self.available_blocks[j].append(new_block)
            self.address_to_block[new_block_address] = new_block
        
        block.bsize = k
            
        return block.address
    
    def deallocate(self, address, size):
        k = calculate_bsize(size)
        
        if k > self.m or k < 0:
            raise ValueError("Must have 0 <= k <= m. m was set to {}. Got k = {}".format(self.m, k))
        
        # Determine the block to be deallocated, given request_address and request_size
        block = self.address_to_block.get(address, None)
        if not block:
            raise ValueError("Must pass a starting address of a block. Got address={}".format(address))
        elif block.bsize != k:
            raise ValueError("Block starting at {} has bsize {}, which should be equal to k. Got k={}".format(address, block.bsize, k))
        elif block.available:
            raise ValueError("Block starting at {} is available. No need to deallocate.".format(address))
        
        # Now we have block.bsize == k
        
        while (k := block.bsize) <= self.m:
            buddy_address = block.get_buddy_address()
            # This is actually the block starting at the buddy_address. Not necessary a buddy block
            buddy_block = self.address_to_block[buddy_address]
        
            # If 
            #   the whole memory is to be deallocated, or 
            #   the buddy_block is not available, or 
            #   the buddy_block is not a real buddy
            if (k == self.m) or (not buddy_block.available) or (buddy_block.bsize != block.bsize):
                block.available = True
                self.available_blocks[k].append(block)
                
                return
        
            # Now we can determine that buddy_block is a read buddy and is available. They can merge.
            
            # First remove the buddy block
            self.available_blocks[k].remove(buddy_block)
            
            # Merge the two buddies
            block.bsize += 1
            
            if buddy_block.address < block.address:
                del self.address_to_block[block.address]
                
                block.address = buddy_block.address
                self.address_to_block[block.address] = block
            else:
                del self.address_to_block[buddy_block.address]
            
        return
    
    def info(self):
        info_str = ""
        for i in range(0, len(self.available_blocks)):
            info_str += "AVAIL[{}]: {}\n".format(i, self.available_blocks[i])
        return info_str

# Test Code
memory_manager = MemoryManager(128)
print(memory_manager.info())

a1 = memory_manager.allocate(32)
a2 = memory_manager.allocate(32)
a3 = memory_manager.allocate(32)
print(memory_manager.info())

memory_manager.deallocate(a2, 32)
print(memory_manager.info())
```

注意：

- 我是完全复刻了 Knuth 的思路
- 严格来说我们处理的 memory 是一个 "起始位置一定是 0 的 VMA (Virtual Memory Area)"
  - 如果你做戏要做全套，想模拟任意 "起始位置为 $P$ 的内存区域"，最简单的做法是在 `MemoryManager` 里加一个 `self.offset = P`
- `bsize` 意思是 "binary size"
  - `bsize = k` 表示 block 的 size 是 `2**k`
  - 我实在是找不到更好的命名了……
- 受 `TAG(address)` 和 `KVAL(address)` 的启发，我设计了一个 `self.address_to_block = dict(<address>: <block>)`
- `allocate()` 为什么不应该 `return block`？因为这个 block object 在 `deallocate()` 的时候是可能被 `del` 掉的；但如果用户手头上有一个 reference，我 `del` 是不可能成功的 (引用计数器不为 0，无法触发 GC)。做戏做全套嘛，模拟就模拟到位……